"use client";

import { useEffect, useState } from "react";

export function LiveClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Lagos",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const update = () => {
      setTime(`${formatter.format(new Date())} WAT`);
    };

    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span
      className="font-mono text-body-xs text-ink/50 tabular-nums transition-opacity duration-300"
      title="Current local time in Lagos, Nigeria (West Africa Time, UTC+1)"
      aria-label="Current local time in Lagos"
    >
      {time || "--:-- WAT"}
    </span>
  );
}
