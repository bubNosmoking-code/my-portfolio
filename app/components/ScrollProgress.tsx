"use client";

import { useEffect, useState } from "react";

/** Fixed vertical "torn spine" bar that fills red as the page scrolls. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 right-0 h-screen w-[5px] z-[60] bg-black/10 pointer-events-none">
      <div
        className="absolute top-0 left-0 w-full bg-[#CC0000]"
        style={{ height: `${progress}%`, transition: "height 80ms linear" }}
      >
        {progress > 0 && (
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-[9px] w-[16px] h-[10px] bg-[#CC0000]"
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          />
        )}
      </div>
    </div>
  );
}
