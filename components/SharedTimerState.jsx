import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { TimerStateContext, useSharedTimerState } from "./TimerStateContext";

const TIMER_STATE_URL = "/api/timer-state";
const POLL_INTERVAL_MS = 3000;

async function readTimerState(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Unable to load shared timer state.");
  }
  if (
    typeof data.paused !== "boolean" ||
    !Number.isFinite(data.totalPausedMs) ||
    !Number.isFinite(data.serverNow) ||
    !Number.isFinite(data.version) ||
    (data.paused && !Number.isFinite(data.pausedAt))
  ) {
    throw new Error("The shared timer returned an invalid state.");
  }
  return data;
}

export function TimerStateProvider({ children }) {
  const [timerState, setTimerState] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [clockOffset, setClockOffset] = useState(0);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const currentState = useRef(null);
  const updating = useRef(false);

  const applyTimerState = useCallback((nextState) => {
    if (currentState.current && nextState.version < currentState.current.version) {
      return;
    }
    currentState.current = nextState;
    setTimerState(nextState);
    setClockOffset(nextState.serverNow - Date.now());
    setNow(nextState.serverNow);
  }, []);

  useEffect(() => {
    let active = true;
    let timeoutId;

    const poll = async () => {
      try {
        const response = await fetch(TIMER_STATE_URL);
        const data = await readTimerState(response);
        if (active) {
          applyTimerState(data);
          setError("");
        }
      } catch {
        if (active) {
          setError("Could not sync the shared timers. Retrying…");
        }
      } finally {
        if (active) {
          timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
        }
      }
    };

    void poll();
    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [applyTimerState]);

  useEffect(() => {
    if (!timerState || timerState.paused) return undefined;
    const intervalId = setInterval(() => {
      setNow(Date.now() + clockOffset);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timerState, clockOffset]);

  const togglePause = async () => {
    if (!currentState.current || updating.current) return;

    updating.current = true;
    setIsUpdating(true);
    setError("");
    try {
      const response = await fetch(TIMER_STATE_URL, { method: "POST" });
      const data = await readTimerState(response);
      applyTimerState(data);
    } catch {
      setError("Could not update the shared timers. Please try again.");
    } finally {
      updating.current = false;
      setIsUpdating(false);
    }
  };

  return (
    <TimerStateContext.Provider
      value={{ timerState, now, error, isUpdating, togglePause }}
    >
      {children}
    </TimerStateContext.Provider>
  );
}

export function SharedTimerControls() {
  const { timerState, error, isUpdating, togglePause } = useSharedTimerState();

  return (
    <div style={{ textAlign: "center", margin: "0 0 2rem" }}>
      <button
        type="button"
        onClick={togglePause}
        disabled={!timerState || isUpdating}
        style={{
          padding: "6px 16px",
          border: "1px solid #e8b4c8",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.7)",
          color: "#d4537e",
          cursor: timerState && !isUpdating ? "pointer" : "not-allowed",
          fontSize: 12,
          opacity: timerState && !isUpdating ? 1 : 0.6,
        }}
      >
        {!timerState
          ? "Connecting timers…"
          : isUpdating
            ? "Updating…"
            : timerState.paused
              ? "Resume both timers"
              : "Pause both timers"}
      </button>
      {error && (
        <p role="alert" style={{ color: "#b42318", fontSize: 12, marginTop: 8 }}>
          {error}
        </p>
      )}
    </div>
  );
}
