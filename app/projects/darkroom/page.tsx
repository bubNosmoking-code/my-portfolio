"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
type Filter = "none" | "grayscale" | "sepia" | "vintage" | "cool" | "warm" | "fade" | "dramatic";
type Format = "png" | "jpeg" | "webp";
type AspectRatio = "free" | "1:1" | "4:3" | "16:9" | "4:5" | "9:16" | "3:2";
type Tab = "develop" | "crop" | "export";

interface Settings {
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
  shadows: number;
  highlights: number;
  temperature: number;
  sharpness: number;
  grain: number;
  vignette: number;
  filter: Filter;
}

const DEFAULT: Settings = {
  brightness: 100, contrast: 100, saturation: 100,
  exposure: 0, shadows: 0, highlights: 0,
  temperature: 0, sharpness: 0, grain: 0, vignette: 0,
  filter: "none",
};

const FILTERS: Record<Filter, string> = {
  none: "",
  grayscale: "grayscale(100%)",
  sepia: "sepia(80%) contrast(110%)",
  vintage: "sepia(40%) brightness(90%) contrast(115%) saturate(80%)",
  cool: "saturate(110%) hue-rotate(20deg) brightness(103%)",
  warm: "sepia(20%) saturate(130%) brightness(102%)",
  fade: "brightness(110%) contrast(85%) saturate(80%)",
  dramatic: "grayscale(30%) contrast(140%) brightness(90%)",
};

const ASPECT_RATIOS: Record<AspectRatio, number | null> = {
  free: null, "1:1": 1, "4:3": 4/3, "16:9": 16/9, "4:5": 4/5, "9:16": 9/16, "3:2": 3/2,
};

// ─────────────────────────────────────────
// CUSTOM CURSOR
// ─────────────────────────────────────────
function DarkroomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const rpos = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.left = e.clientX + "px";
        dot.current.style.top = e.clientY + "px";
      }
    };
    const tick = () => {
      rpos.current.x += (pos.current.x - rpos.current.x) * 0.1;
      rpos.current.y += (pos.current.y - rpos.current.y) * 0.1;
      if (ring.current) {
        ring.current.style.left = rpos.current.x + "px";
        ring.current.style.top = rpos.current.y + "px";
      }
      raf.current = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    tick();
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf.current); };
  }, []);

  return (
    <>
      <div ref={dot} style={{ position: "fixed", width: 5, height: 5, borderRadius: "50%", background: "#C8321A", pointerEvents: "none", zIndex: 9999, transform: "translate(-50%,-50%)", boxShadow: "0 0 8px #C8321A" }} />
      <div ref={ring} style={{ position: "fixed", width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(200,50,26,0.4)", pointerEvents: "none", zIndex: 9998, transform: "translate(-50%,-50%)" }} />
    </>
  );
}

// ─────────────────────────────────────────
// DEVELOP SLIDER
// ─────────────────────────────────────────
function DevSlider({ label, value, min, max, step = 1, onChange, unit = "" }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; unit?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontFamily: "Courier Prime, monospace", fontSize: 11, color: "rgba(245,230,200,0.7)", letterSpacing: "0.15em", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontFamily: "Courier Prime, monospace", fontSize: 11, color: "#E04020", minWidth: 36, textAlign: "right" }}>{value > 0 && min < 0 ? `+${value}` : value}{unit}</span>
      </div>
      <div style={{ position: "relative", height: 2, background: "rgba(245,230,200,0.15)", borderRadius: 1 }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, rgba(220,60,30,0.5), #E04020)", borderRadius: 1 }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ position: "absolute", inset: "-8px 0", width: "100%", opacity: 0, cursor: "none", height: 18 }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────
export default function DarkroomPage() {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT);
  const [tab, setTab] = useState<Tab>("develop");
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [developed, setDeveloped] = useState(false);
  const [format, setFormat] = useState<Format>("jpeg");
  const [quality, setQuality] = useState(90);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("free");
  const [downloadPulse, setDownloadPulse] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = useCallback(<K extends keyof Settings>(k: K, v: Settings[K]) => {
    setSettings(prev => ({ ...prev, [k]: v }));
  }, []);

  const loadFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setDeveloped(false);
    setProcessing(true);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImgSrc(url);
      setImgEl(img);
      setTimeout(() => { setProcessing(false); setDeveloped(true); }, 800);
    };
    img.src = url;
  };

  // ── Canvas rendering ──
  useEffect(() => {
    if (!imgEl || !previewRef.current) return;
    const canvas = previewRef.current;
    const ctx = canvas.getContext("2d")!;

    const MAX = 1200;
    let w = imgEl.naturalWidth, h = imgEl.naturalHeight;
    if (w > MAX || h > MAX) {
      const r = Math.min(MAX / w, MAX / h);
      w = Math.round(w * r); h = Math.round(h * r);
    }
    canvas.width = w; canvas.height = h;

    // Apply CSS filters via offscreen
    const off = document.createElement("canvas");
    off.width = w; off.height = h;
    const offCtx = off.getContext("2d")!;

    const brightness = settings.brightness + settings.exposure * 1.5;
    const contrast = settings.contrast + settings.shadows * 0.3 + settings.highlights * 0.3;
    const filterStr = [
      `brightness(${brightness}%)`,
      `contrast(${contrast}%)`,
      `saturate(${settings.saturation}%)`,
      settings.temperature > 0 ? `sepia(${settings.temperature * 0.4}%) saturate(${100 + settings.temperature}%)` : `hue-rotate(${settings.temperature * 0.2}deg)`,
      FILTERS[settings.filter],
    ].filter(Boolean).join(" ");

    offCtx.filter = filterStr;
    offCtx.drawImage(imgEl, 0, 0, w, h);

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(off, 0, 0);

    // Sharpness (unsharp mask simulation)
    if (settings.sharpness > 0) {
      const amount = settings.sharpness / 100;
      const id = ctx.getImageData(0, 0, w, h);
      const d = id.data;
      for (let i = 0; i < d.length; i += 4) {
        d[i] = Math.min(255, d[i] * (1 + amount * 0.3));
        d[i+1] = Math.min(255, d[i+1] * (1 + amount * 0.3));
        d[i+2] = Math.min(255, d[i+2] * (1 + amount * 0.3));
      }
      ctx.putImageData(id, 0, 0);
    }

    // Film grain
    if (settings.grain > 0) {
      const id = ctx.getImageData(0, 0, w, h);
      const d = id.data;
      const intensity = settings.grain * 0.6;
      for (let i = 0; i < d.length; i += 4) {
        const noise = (Math.random() - 0.5) * intensity;
        d[i] = Math.max(0, Math.min(255, d[i] + noise));
        d[i+1] = Math.max(0, Math.min(255, d[i+1] + noise));
        d[i+2] = Math.max(0, Math.min(255, d[i+2] + noise));
      }
      ctx.putImageData(id, 0, 0);
    }

    // Vignette
    if (settings.vignette > 0) {
      const vg = ctx.createRadialGradient(w/2, h/2, Math.min(w,h)*0.3, w/2, h/2, Math.max(w,h)*0.75);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, `rgba(0,0,0,${settings.vignette / 150})`);
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);
    }

  }, [imgEl, settings]);

  // ── Download ──
  const handleDownload = () => {
    if (!previewRef.current) return;
    setDownloadPulse(true);
    setTimeout(() => setDownloadPulse(false), 800);

    const out = document.createElement("canvas");
    let w = previewRef.current.width, h = previewRef.current.height;
    if (aspectRatio !== "free") {
      const ratio = ASPECT_RATIOS[aspectRatio]!;
      if (w / h > ratio) { w = Math.round(h * ratio); }
      else { h = Math.round(w / ratio); }
    }
    out.width = w; out.height = h;
    const ctx = out.getContext("2d")!;
    ctx.drawImage(previewRef.current, (previewRef.current.width - w) / 2, (previewRef.current.height - h) / 2, w, h, 0, 0, w, h);
    const url = out.toDataURL(`image/${format}`, quality / 100);
    const a = document.createElement("a");
    a.href = url; a.download = `darkroom-${Date.now()}.${format}`; a.click();
  };

  const resetSettings = () => setSettings(DEFAULT);

  // ─── RENDER ───
  return (
    <div style={{ minHeight: "100vh", background: "#160E08", color: "#F5E6C8", cursor: "none", display: "flex", flexDirection: "column", fontFamily: "Courier Prime, monospace" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap');

        * { cursor: none !important; box-sizing: border-box; }

        @keyframes develop {
          0% { filter: brightness(300%) saturate(0%); opacity: 0.3; }
          30% { filter: brightness(200%) saturate(20%) sepia(40%); opacity: 0.6; }
          70% { filter: brightness(130%) saturate(60%); opacity: 0.85; }
          100% { filter: brightness(100%) saturate(100%); opacity: 1; }
        }
        @keyframes redGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(200,50,26,0.15); }
          50% { box-shadow: 0 0 40px rgba(200,50,26,0.3); }
        }
        @keyframes paperOut {
          0% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-6px) scale(1.02); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes scanline {
          0% { top: -2px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .dr-panel-left {
          width: 280px;
          min-width: 280px;
          background: #1E1108;
          border-right: 1px solid rgba(200,50,26,0.25);
          height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
          scrollbar-color: rgba(200,50,26,0.3) transparent;
        }
        .dr-panel-left::-webkit-scrollbar { width: 2px; }
        .dr-panel-left::-webkit-scrollbar-thumb { background: rgba(200,50,26,0.25); }

        .dr-tab {
          fontFamily: Courier Prime, monospace;
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          padding: 10px 16px; background: transparent;
          border: none; color: rgba(245,230,200,0.5);
          transition: color 0.2s; position: relative;
        }
        .dr-tab.active { color: #E04020; }
        .dr-tab.active::after {
          content: ''; position: absolute; bottom: 0; left: 16px; right: 16px;
          height: 1px; background: #E04020;
        }
        .dr-tab:hover { color: rgba(245,230,200,0.85); }

        .filter-pill {
          font-family: Courier Prime, monospace;
          font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 6px 10px; border: 1px solid rgba(245,230,200,0.15);
          background: transparent; color: rgba(245,230,200,0.55);
          transition: all 0.2s;
        }
        .filter-pill.active {
          border-color: #E04020; color: #E04020;
          background: rgba(200,50,26,0.12);
        }
        .filter-pill:hover:not(.active) { color: rgba(245,230,200,0.9); border-color: rgba(245,230,200,0.35); }

        .btn-download {
          width: 100%; padding: 13px;
          background: #C8321A; color: #F5E6C8;
          font-family: DM Serif Display, serif; font-size: 16px;
          border: none; letter-spacing: 0.05em;
          position: relative; overflow: hidden;
          transition: background 0.2s;
        }
        .btn-download:hover { background: #A82715; }
        .btn-download.pulse { animation: paperOut 0.7s ease; }
        .btn-download::before {
          content: ''; position: absolute; left: 0; right: 0; height: 1px;
          background: rgba(245,230,200,0.3);
          animation: scanline 2s ease infinite;
          animation-play-state: paused;
        }
        .btn-download:hover::before { animation-play-state: running; }

        .btn-reset {
          font-family: Courier Prime, monospace; font-size: 9px;
          letter-spacing: 0.2em; text-transform: uppercase; padding: 7px 12px;
          background: transparent; color: rgba(245,230,200,0.4);
          border: 1px solid rgba(245,230,200,0.15); transition: all 0.2s;
        }
        .btn-reset:hover { color: rgba(245,230,200,0.8); border-color: rgba(245,230,200,0.4); }

        .section-label {
          font-family: Courier Prime, monospace; font-size: 9px;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(245,230,200,0.4);
          padding-bottom: 12px; margin-bottom: 16px;
          border-bottom: 1px solid rgba(245,230,200,0.1);
        }

        .format-btn {
          font-family: Courier Prime, monospace; font-size: 10px;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 8px 16px; background: transparent;
          border: 1px solid rgba(245,230,200,0.15);
          color: rgba(245,230,200,0.5); transition: all 0.2s; flex: 1;
        }
        .format-btn.active {
          background: rgba(200,50,26,0.15); border-color: #E04020; color: #E04020;
        }

        .ratio-btn {
          font-family: Courier Prime, monospace; font-size: 9px;
          letter-spacing: 0.1em; padding: 6px 10px; background: transparent;
          border: 1px solid rgba(245,230,200,0.15);
          color: rgba(245,230,200,0.5); transition: all 0.2s;
        }
        .ratio-btn.active {
          border-color: rgba(220,60,30,0.8); color: #E04020;
          background: rgba(200,50,26,0.1);
        }

        .drop-zone {
          border: 1px dashed rgba(200,50,26,0.25);
          transition: all 0.3s;
          animation: redGlow 3s ease infinite;
        }
        .drop-zone.over {
          border-color: #C8321A;
          background: rgba(200,50,26,0.06) !important;
        }

        .developing canvas {
          animation: develop 1.2s ease forwards;
        }

        .noise-overlay {
          position: absolute; inset: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
          opacity: 0.35; mix-blend-mode: overlay;
        }
      `}</style>

      <DarkroomCursor />

      <div style={{ display: "flex", flex: 1, height: "100vh", overflow: "hidden" }}>

        {/* ════════════ LEFT PANEL ════════════ */}
        <div className="dr-panel-left">
          {/* Logo */}
          <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid rgba(200,50,26,0.12)" }}>
            <Link href="/" style={{ fontFamily: "Courier Prime", fontSize: 10, letterSpacing: "0.2em", color: "rgba(245,230,200,0.2)", textDecoration: "none", textTransform: "uppercase", display: "block", marginBottom: 16 }}
              onMouseOver={e => (e.currentTarget.style.color = "rgba(245,230,200,0.5)")}
              onMouseOut={e => (e.currentTarget.style.color = "rgba(245,230,200,0.2)")}>
              ← Back
            </Link>
            <div style={{ fontFamily: "DM Serif Display", fontSize: 26, fontStyle: "italic", color: "#F5E6C8", lineHeight: 1, letterSpacing: "0.01em" }}>
              Dark<span style={{ color: "#C8321A" }}>room</span>
            </div>
            <div style={{ fontFamily: "Courier Prime", fontSize: 9, color: "rgba(245,230,200,0.2)", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: 4 }}>
              Image Lab
            </div>
          </div>

          {/* Upload button */}
          <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(245,230,200,0.04)" }}>
            <button
              onClick={() => fileRef.current?.click()}
              style={{ width: "100%", padding: "10px", background: "rgba(200,50,26,0.08)", border: "1px solid rgba(200,50,26,0.2)", color: "#C8321A", fontFamily: "Courier Prime", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              onMouseOver={e => (e.currentTarget.style.background = "rgba(200,50,26,0.15)")}
              onMouseOut={e => (e.currentTarget.style.background = "rgba(200,50,26,0.08)")}>
              <span style={{ fontSize: 14 }}>⬆</span> Load Film
            </button>
          </div>

          {/* Tabs */}
          {imgEl && (
            <div style={{ display: "flex", borderBottom: "1px solid rgba(245,230,200,0.12)", padding: "0 8px" }}>
              {(["develop", "crop", "export"] as Tab[]).map(t => (
                <button key={t} className={`dr-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Panel content */}
          <div style={{ padding: 24 }}>
            {!imgEl && (
              <div style={{ fontFamily: "Courier Prime", fontSize: 10, color: "rgba(245,230,200,0.45)", lineHeight: 1.8, letterSpacing: "0.05em" }}>
                Load an image to begin<br />developing your film.
                <div style={{ marginTop: 24, borderTop: "1px solid rgba(245,230,200,0.1)", paddingTop: 24 }}>
                  <div style={{ color: "rgba(245,230,200,0.3)", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Supports</div>
                  JPG · PNG · WebP · GIF
                </div>
              </div>
            )}

            {imgEl && tab === "develop" && (
              <div style={{ animation: "fadeIn 0.4s ease" }}>
                {/* Preset Filters */}
                <div className="section-label">Presets</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 28 }}>
                  {(Object.keys(FILTERS) as Filter[]).map(f => (
                    <button key={f} className={`filter-pill ${settings.filter === f ? "active" : ""}`} onClick={() => set("filter", f)}>
                      {f}
                    </button>
                  ))}
                </div>

                {/* Tone */}
                <div className="section-label">Tone</div>
                <DevSlider label="Exposure" value={settings.exposure} min={-50} max={50} onChange={v => set("exposure", v)} />
                <DevSlider label="Brightness" value={settings.brightness} min={50} max={150} unit="%" onChange={v => set("brightness", v)} />
                <DevSlider label="Contrast" value={settings.contrast} min={50} max={200} unit="%" onChange={v => set("contrast", v)} />
                <DevSlider label="Shadows" value={settings.shadows} min={-50} max={50} onChange={v => set("shadows", v)} />
                <DevSlider label="Highlights" value={settings.highlights} min={-50} max={50} onChange={v => set("highlights", v)} />

                {/* Color */}
                <div className="section-label" style={{ marginTop: 28 }}>Colour</div>
                <DevSlider label="Saturation" value={settings.saturation} min={0} max={200} unit="%" onChange={v => set("saturation", v)} />
                <DevSlider label="Temperature" value={settings.temperature} min={-50} max={50} onChange={v => set("temperature", v)} />

                {/* Texture */}
                <div className="section-label" style={{ marginTop: 28 }}>Texture</div>
                <DevSlider label="Sharpness" value={settings.sharpness} min={0} max={100} onChange={v => set("sharpness", v)} />
                <DevSlider label="Film Grain" value={settings.grain} min={0} max={80} onChange={v => set("grain", v)} />
                <DevSlider label="Vignette" value={settings.vignette} min={0} max={100} onChange={v => set("vignette", v)} />

                <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
                  <button className="btn-reset" onClick={resetSettings}>Reset All</button>
                </div>
              </div>
            )}

            {imgEl && tab === "crop" && (
              <div style={{ animation: "fadeIn 0.4s ease" }}>
                <div className="section-label">Aspect Ratio</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(Object.keys(ASPECT_RATIOS) as AspectRatio[]).map(r => (
                    <button key={r} className={`ratio-btn ${aspectRatio === r ? "active" : ""}`} onClick={() => setAspectRatio(r)}>
                      {r}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: 24, padding: 16, border: "1px solid rgba(245,230,200,0.12)", background: "rgba(245,230,200,0.03)" }}>
                  <div style={{ fontFamily: "Courier Prime", fontSize: 9, color: "rgba(245,230,200,0.4)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Current Ratio</div>
                  <div style={{ fontFamily: "DM Serif Display", fontSize: 22, color: "#E04020", fontStyle: "italic" }}>{aspectRatio}</div>
                  {imgEl && (
                    <div style={{ fontFamily: "Courier Prime", fontSize: 10, color: "rgba(245,230,200,0.25)", marginTop: 4 }}>
                      {imgEl.naturalWidth} × {imgEl.naturalHeight}px
                    </div>
                  )}
                </div>
              </div>
            )}

            {imgEl && tab === "export" && (
              <div style={{ animation: "fadeIn 0.4s ease" }}>
                <div className="section-label">Format</div>
                <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
                  {(["jpeg", "png", "webp"] as Format[]).map(f => (
                    <button key={f} className={`format-btn ${format === f ? "active" : ""}`} onClick={() => setFormat(f)}>
                      {f}
                    </button>
                  ))}
                </div>

                {format !== "png" && (
                  <>
                    <div className="section-label">Quality</div>
                    <DevSlider label="Quality" value={quality} min={40} max={100} unit="%" onChange={setQuality} />
                  </>
                )}

                <div style={{ marginTop: 8, padding: 14, border: "1px solid rgba(245,230,200,0.12)", background: "rgba(245,230,200,0.04)", fontFamily: "Courier Prime", fontSize: 10, color: "rgba(245,230,200,0.55)", lineHeight: 1.6 }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,230,200,0.3)", marginBottom: 6 }}>Export Info</div>
                  Ratio: {aspectRatio}<br />
                  Format: .{format}<br />
                  {format !== "png" && <>Quality: {quality}%</>}
                </div>
              </div>
            )}
          </div>

          {/* Download */}
          {imgEl && (
            <div style={{ padding: "0 24px 24px", marginTop: "auto" }}>
              <button className={`btn-download ${downloadPulse ? "pulse" : ""}`} onClick={handleDownload}>
                Develop & Save
              </button>
            </div>
          )}
        </div>

        {/* ════════════ MAIN CANVAS ════════════ */}
        <div
          className={`drop-zone ${dragging ? "over" : ""}`}
          style={{ flex: 1, background: "#120B06", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
          onClick={() => !imgEl && fileRef.current?.click()}
        >
          {/* Noise overlay */}
          <div className="noise-overlay" />

          {/* Corner brackets */}
          {["tl","tr","bl","br"].map(c => (
            <div key={c} style={{
              position: "absolute",
              top: c.startsWith("t") ? 24 : "auto", bottom: c.startsWith("b") ? 24 : "auto",
              left: c.endsWith("l") ? 24 : "auto", right: c.endsWith("r") ? 24 : "auto",
              width: 20, height: 20,
              borderTop: c.startsWith("t") ? "1px solid rgba(200,50,26,0.3)" : "none",
              borderBottom: c.startsWith("b") ? "1px solid rgba(200,50,26,0.3)" : "none",
              borderLeft: c.endsWith("l") ? "1px solid rgba(200,50,26,0.3)" : "none",
              borderRight: c.endsWith("r") ? "1px solid rgba(200,50,26,0.3)" : "none",
              pointerEvents: "none",
            }} />
          ))}

          {/* Scanline overlay when processing */}
          {processing && (
            <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(13,9,7,0.7)" }}>
              <div style={{ fontFamily: "DM Serif Display", fontSize: 32, fontStyle: "italic", color: "#C8321A", animation: "pulse 1s ease infinite" }}>
                Developing<span style={{ color: "rgba(200,50,26,0.4)" }}>...</span>
              </div>
              <div style={{ fontFamily: "Courier Prime", fontSize: 9, color: "rgba(245,230,200,0.2)", letterSpacing: "0.3em", textTransform: "uppercase", marginTop: 12 }}>
                Film in bath
              </div>
            </div>
          )}

          {/* Empty state */}
          {!imgEl && !processing && (
            <div style={{ textAlign: "center", userSelect: "none", animation: "fadeIn 0.5s ease" }}>
              <div style={{ fontFamily: "DM Serif Display", fontSize: "clamp(3rem,8vw,6rem)", fontStyle: "italic", color: "rgba(200,50,26,0.35)", lineHeight: 1, marginBottom: 24 }}>
                Load your<br />film here
              </div>
              <div style={{ fontFamily: "Courier Prime", fontSize: 11, color: "rgba(245,230,200,0.45)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
                Drag & drop or click
              </div>
              <div style={{ fontFamily: "Courier Prime", fontSize: 10, color: "rgba(245,230,200,0.25)", letterSpacing: "0.1em" }}>
                JPG · PNG · WebP
              </div>
            </div>
          )}

          {/* Canvas preview */}
          {imgEl && (
            <div className={developed ? "developing" : ""} style={{ maxWidth: "90%", maxHeight: "90vh", position: "relative", boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,50,26,0.1)" }}>
              <canvas
                ref={previewRef}
                style={{ display: "block", maxWidth: "100%", maxHeight: "85vh", objectFit: "contain" }}
              />
              {/* Crop overlay */}
              {tab === "crop" && aspectRatio !== "free" && (
                <CropOverlay ratio={ASPECT_RATIOS[aspectRatio]!} />
              )}
            </div>
          )}

          {/* Bottom strip info */}
          {imgEl && (
            <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 24, alignItems: "center" }}>
              {[
                { l: "F", v: settings.filter === "none" ? "—" : settings.filter },
                { l: "EV", v: settings.exposure > 0 ? `+${settings.exposure}` : String(settings.exposure) },
                { l: "GRAIN", v: `${settings.grain}%` },
                { l: "VIG", v: `${settings.vignette}%` },
              ].map(x => (
                <div key={x.l} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Courier Prime", fontSize: 8, color: "rgba(245,230,200,0.35)", letterSpacing: "0.25em", textTransform: "uppercase" }}>{x.l}</div>
                  <div style={{ fontFamily: "Courier Prime", fontSize: 11, color: "rgba(245,230,200,0.65)", marginTop: 2 }}>{x.v}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

// ─────────────────────────────────────────
// CROP OVERLAY
// ─────────────────────────────────────────
function CropOverlay({ ratio }: { ratio: number }) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* Darken sides */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          {/* We approximate crop region */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(13,9,7,0.5)" }} />
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            border: "1px solid rgba(200,50,26,0.6)",
            boxShadow: "0 0 0 9999px rgba(13,9,7,0.5)",
            aspectRatio: String(ratio),
            height: "80%",
            maxWidth: "90%",
          }} />
        </div>
      </div>
    </div>
  );
}