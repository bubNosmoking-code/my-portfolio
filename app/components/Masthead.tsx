"use client";

import { useEffect, useState } from "react";

/** Issue no. = days since the paper went to press. */
const FIRST_ISSUE_DATE = new Date("2026-01-01T00:00:00+08:00");

/** open-meteo WMO weather codes → newspaper-style glyph. */
function weatherGlyph(code: number): string {
  if (code === 0) return "☀";
  if (code <= 2) return "🌤";
  if (code === 3) return "☁";
  if (code <= 48) return "🌫";
  if (code <= 67) return "☂";
  if (code <= 77) return "❄";
  if (code <= 82) return "☂";
  return "⛈";
}

/**
 * Live newspaper masthead line: real date · issue number · Shenzhen weather.
 * Weather silently omitted if the fetch fails.
 */
export function Masthead() {
  const [weather, setWeather] = useState<string | null>(null);

  const now = new Date();
  const dateStr = now
    .toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    .toUpperCase();
  const issueNo = Math.max(1, Math.floor((now.getTime() - FIRST_ISSUE_DATE.getTime()) / 86400000) + 1);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=22.54&longitude=114.06&current_weather=true",
      { signal: ctrl.signal }
    )
      .then((r) => r.json())
      .then((d) => {
        const cw = d?.current_weather;
        if (cw && typeof cw.temperature === "number") {
          setWeather(`${weatherGlyph(cw.weathercode)} ${Math.round(cw.temperature)}°C`);
        }
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full border-b border-black/60 font-mono-data text-[10px] uppercase tracking-widest">
      <div className="flex justify-between items-center px-4 md:px-6 py-1.5 text-black/60">
        <span className="hidden sm:inline">{dateStr}</span>
        <span className="sm:hidden">{now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}</span>
        <span className="font-bold text-black/70">
          Vol. 1 &mdash; No. {issueNo}
        </span>
        <span className="flex items-center gap-3">
          <span className="hidden md:inline">Shenzhen{weather ? ` ${weather}` : ""}</span>
          <span className="md:hidden">{weather ?? "SZ"}</span>
          <span className="text-black/40">&middot;</span>
          <span>Price: Free</span>
        </span>
      </div>
    </div>
  );
}
