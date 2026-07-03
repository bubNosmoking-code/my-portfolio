"use client";

/**
 * Printer's crop marks at the four corners of the page container,
 * as if the newspaper hasn't been trimmed yet. Parent must be `relative`.
 */
export function CropMarks() {
  const arm = "absolute bg-black/50";
  return (
    <div className="pointer-events-none absolute inset-0 z-40 hidden lg:block" aria-hidden="true">
      {/* top-left */}
      <span className={`${arm} -top-4 left-0 w-px h-3`} />
      <span className={`${arm} top-0 -left-4 w-3 h-px`} />
      {/* top-right */}
      <span className={`${arm} -top-4 right-0 w-px h-3`} />
      <span className={`${arm} top-0 -right-4 w-3 h-px`} />
      {/* bottom-left */}
      <span className={`${arm} -bottom-4 left-0 w-px h-3`} />
      <span className={`${arm} bottom-0 -left-4 w-3 h-px`} />
      {/* bottom-right */}
      <span className={`${arm} -bottom-4 right-0 w-px h-3`} />
      <span className={`${arm} bottom-0 -right-4 w-3 h-px`} />
      {/* registration color bar, top-left outside the trim */}
      <span className="absolute -top-[13px] left-8 flex gap-px">
        <span className="w-2 h-2 bg-[#00AEEF]/70" />
        <span className="w-2 h-2 bg-[#EC008C]/70" />
        <span className="w-2 h-2 bg-[#FFF200]/90" />
        <span className="w-2 h-2 bg-black/80" />
      </span>
    </div>
  );
}
