import { createClient } from "@libsql/client";
import process from "node:process";

let client;
let initialization;

function getClient() {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!url || !authToken) {
      throw new Error("Shared timer database is not configured.");
    }
    client = createClient({ url, authToken });
  }
  return client;
}

async function initializeDatabase(database) {
  if (!initialization) {
    initialization = (async () => {
      await database.execute(`
        CREATE TABLE IF NOT EXISTS shared_timer_state (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          is_paused INTEGER NOT NULL DEFAULT 0,
          paused_at INTEGER,
          total_paused_ms INTEGER NOT NULL DEFAULT 0,
          version INTEGER NOT NULL DEFAULT 0
        )
      `);
      await database.execute(`
        INSERT OR IGNORE INTO shared_timer_state (id) VALUES (1)
      `);
    })();
  }
  try {
    await initialization;
  } catch (error) {
    initialization = undefined;
    throw error;
  }
}

function serializeState(row, serverNow = Date.now()) {
  return {
    paused: Number(row.is_paused) === 1,
    pausedAt: row.paused_at === null ? null : Number(row.paused_at),
    totalPausedMs: Number(row.total_paused_ms),
    version: Number(row.version),
    serverNow,
  };
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

export const handler = async (event) => {
  if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
    return response(405, { error: "Method not allowed." });
  }

  let database;
  try {
    database = getClient();
    await initializeDatabase(database);

    if (event.httpMethod === "GET") {
      const result = await database.execute(
        "SELECT * FROM shared_timer_state WHERE id = 1",
      );
      return response(200, serializeState(result.rows[0]));
    }

    const transaction = await database.transaction("write");
    try {
      const result = await transaction.execute(
        "SELECT * FROM shared_timer_state WHERE id = 1",
      );
      const current = result.rows[0];
      const now = Date.now();

      if (Number(current.is_paused) === 1) {
        const totalPausedMs =
          Number(current.total_paused_ms) + now - Number(current.paused_at);
        await transaction.execute({
          sql: `
            UPDATE shared_timer_state
            SET is_paused = 0, paused_at = NULL, total_paused_ms = ?, version = version + 1
            WHERE id = 1
          `,
          args: [totalPausedMs],
        });
      } else {
        await transaction.execute({
          sql: `
            UPDATE shared_timer_state
            SET is_paused = 1, paused_at = ?, version = version + 1
            WHERE id = 1
          `,
          args: [now],
        });
      }

      const updated = await transaction.execute(
        "SELECT * FROM shared_timer_state WHERE id = 1",
      );
      await transaction.commit();
      return response(200, serializeState(updated.rows[0], now));
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Shared timer request failed:", error.message);
    const notConfigured = error.message === "Shared timer database is not configured.";
    return response(notConfigured ? 503 : 500, {
      error: notConfigured
        ? error.message
        : "Unable to access shared timer state.",
    });
  }
};
