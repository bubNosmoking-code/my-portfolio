"use client";

import { useEffect, useState } from "react";

function Digit({ value }: { value: number }) {
  return (
    <div className="relative h-[1em] w-[0.64em] overflow-hidden inline-block align-top">
      <div
        className="absolute left-0 top-0 transition-transform duration-500 ease-out"
        style={{ transform: `translateY(-${value}em)` }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-[1em] leading-[1em] flex items-center justify-center">
            {i}
          </div>
        ))}
      </div>
    </div>
  );
}

type PrintCounterProps = {
  target: number;
  digits?: number;
  label?: string;
};

/** Decorative odometer-style counter, like a printing press run number stamp. */
export function PrintCounter({ target, digits = 6, label = "PRESS RUN NO." }: PrintCounterProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 1400;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.floor(eased * target));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const str = String(value).padStart(digits, "0").slice(-digits);

  return (
    <div className="inline-flex items-center gap-2 font-mono-data text-sm font-bold">
      <span className="text-[9px] font-normal uppercase tracking-widest text-neutral-500">{label}</span>
      <div className="flex border border-black bg-[#111111] text-white px-2 py-1">
        {str.split("").map((ch, i) => (
          <Digit key={i} value={parseInt(ch, 10)} />
        ))}
      </div>
    </div>
  );
}
