"use client";

import { CSSProperties } from "react";

type SiteCardProps = {
  title: string;
  domain: string;
  tag: string;
  index: number;
  image?: string;
  href?: string;
  tilt?: number; // kept for caller compatibility, no longer used visually
  /** 0–1, how close the card is to the viewport center; 1 = enlarged */
  focus?: number;
  className?: string;
};

const PLACEHOLDER_IMAGE = "/images/coffee robot.png";

/**
 * Newspaper plate: full-colour screenshot in a thin black frame on a white
 * matte, caption set below like a figure. On hover the (full-page) screenshot
 * slowly pans from top to bottom inside the frame.
 */
export function SiteCard({ title, domain, tag, index, image = PLACEHOLDER_IMAGE, href = "#", focus = 0, className = "" }: SiteCardProps) {
  const style: CSSProperties = {
    transform: `scale(${1 + 0.04 * focus})`,
    zIndex: focus > 0.5 ? 10 : undefined,
    boxShadow: focus > 0.5 ? "12px 12px 0 0 rgba(17,17,17,0.9)" : "6px 6px 0 0 rgba(17,17,17,0.12)",
  };

  return (
    <div
      data-sitecard="1"
      style={style}
      className={`group relative shrink-0 w-[78vw] sm:w-[400px] md:w-[460px] bg-white border border-black p-4 md:p-5 pb-3 transition-[box-shadow] duration-300 ease-out hover:z-20 ${className}`}
    >
      {/* the plate — frame adopts the screenshot's own aspect ratio, nothing cropped */}
      <div className="relative border border-black overflow-hidden bg-neutral-100">
        <img
          src={image}
          alt={title}
          className="block w-full h-auto"
        />
      </div>

      {/* caption, like a figure legend */}
      <div className="pt-3 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <div className="font-headline text-lg md:text-xl font-bold leading-tight truncate" style={{ fontFamily: "'Playfair Display', serif" }}>
            {title}
          </div>
          <div className="font-mono-data text-[10px] text-black/40 tracking-widest mt-0.5 truncate">
            Fig. {String(index).padStart(2, "0")} &mdash; {domain}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono-data text-[10px] text-[#CC0000] tracking-widest uppercase">{tag}</div>
          <div className="font-mono-data text-[10px] text-black/30 tracking-widest uppercase mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            View Site &rarr;
          </div>
        </div>
      </div>

      <a href={href} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-30" aria-label={`Visit ${title}`} />
    </div>
  );
}
