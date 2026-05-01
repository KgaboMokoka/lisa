import { useEffect, useState } from "react"

export default function TimeSince() {
    const startDate = new Date("2026-02-03T21:24:00");
    const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const pad = (n) => String(n).padStart(2, "0");

    useEffect(() => {
        const updateTimer = () => {
            const diff = Date.now() - startDate;
            setTime({
                days:    Math.floor(diff / 86400000),
                hours:   Math.floor(diff / 3600000) % 24,
                minutes: Math.floor(diff / 60000) % 60,
                seconds: Math.floor(diff / 1000) % 60,
            });
        };
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    const Unit = ({ value, label }) => (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 56 }}>
            <span style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 48, fontWeight: 400, lineHeight: 1,
                fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em",
            }}>
                {pad(value)}
            </span>
            <span style={{ fontSize: 10, letterSpacing: "0.14em", color: "#c084a0", textTransform: "uppercase", marginTop: 8 }}>
                {label}
            </span>
        </div>
    );

    const Sep = () => (
        <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 36, color: "#e8b4c8", paddingBottom: 14, lineHeight: 1,
        }}>·</span>
    );

    return (
        <div style={{ padding: "2.5rem 0 2rem", textAlign: "center" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.18em", color: "#c084a0", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                counting every moment
            </p>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: 22, margin: "0 0 2rem", fontWeight: 400 }}>
                since we started talking
            </p>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 4 }}>
                <Unit value={time.days}    label="days"    />
                <Sep />
                <Unit value={time.hours}   label="hours"   />
                <Sep />
                <Unit value={time.minutes} label="minutes" />
                <Sep />
                <Unit value={time.seconds} label="seconds" />
            </div>
            <p style={{ marginTop: "1.8rem", fontSize: 12, color: "#999", fontStyle: "italic" }}>
                and every single one has mattered <span style={{ color: "#d4537e" }}>♥</span>
            </p>
        </div>
    );
}