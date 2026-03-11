"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ============================================================
// TYPES
// ============================================================
interface Topic {
  title: string;
  angle: string;
  platform_fit: string;
}

interface PlatformContent {
  linkedin: string;
  tiktok: string;
  facebook: string;
}

interface CalendarEntry {
  id: string;
  date: string;
  platform: "linkedin" | "tiktok" | "facebook";
  topic: string;
  content: string;
  status: "draft" | "scheduled" | "published";
}

type Step = 1 | 2 | 3 | 4;

// ============================================================
// CONSTANTS
// ============================================================
const PLATFORM_CONFIG = {
  linkedin: {
    label: "LinkedIn",
    color: "#0A66C2",
    dimColor: "#0A66C220",
    tag: "B2B · PROFESSIONAL",
    format: "300-500 words · CTA at end · Insight-driven",
  },
  tiktok: {
    label: "TikTok",
    color: "#EEEEEE",
    dimColor: "#FFFFFF10",
    tag: "SHORT-FORM · HOOK-FIRST",
    format: "15-30s script · 3s hook · Caption + hashtags",
  },
  facebook: {
    label: "Facebook",
    color: "#4A6FA5",
    dimColor: "#4A6FA520",
    tag: "SOCIAL · AD-READY",
    format: "Emotional · Mid-length · Ad copy format",
  },
};

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// ============================================================
// GEMINI API CALL
// ============================================================
async function callGemini(prompt: string): Promise<string> {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini");
  return text;
}

// ============================================================
// TYPEWRITER HOOK
// ============================================================
function useTypewriter(text: string, speed = 8) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) { setDisplayed(""); setDone(false); return; }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i += 3;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { setDone(true); clearInterval(interval); }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

// ============================================================
// TICKER
// ============================================================
function Ticker() {
  const items = [
    "LINKEDIN FEED · ACTIVE",
    "TIKTOK TRENDING · 2.4M VIEWS",
    "FACEBOOK ADS · CPM $12.40",
    "CONTENT CALENDAR · WEEK 11",
    "GEO OPTIMIZATION · ENABLED",
    "BRAND VOICE · LOCKED",
    "LAST SYNC · JUST NOW",
  ];
  const text = items.join("  ·  ") + "  ·  " + items.join("  ·  ");

  return (
    <div className="ticker-wrap">
      <div className="ticker-move font-mono text-[10px] tracking-[0.2em] text-amber-400/60 uppercase whitespace-nowrap">
        {text}
      </div>
    </div>
  );
}

// ============================================================
// STEP INDICATOR
// ============================================================
function StepIndicator({ current }: { current: Step }) {
  const steps = [
    { n: 1, label: "BRAND VOICE" },
    { n: 2, label: "TOPICS" },
    { n: 3, label: "CONTENT" },
    { n: 4, label: "CALENDAR" },
  ];
  return (
    <div className="flex items-center gap-0">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 transition-all duration-300 ${
              current === s.n
                ? "bg-amber-400 text-black"
                : current > s.n
                ? "bg-amber-400/20 text-amber-400"
                : "bg-transparent text-white/20"
            }`}
          >
            <span className="font-mono text-[10px] font-bold">{String(s.n).padStart(2, "0")}</span>
            <span className="font-mono text-[9px] tracking-widest hidden md:block">{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-6 h-[1px] ${current > s.n ? "bg-amber-400/40" : "bg-white/10"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// PLATFORM CONTENT CARD
// ============================================================
function PlatformCard({
  platform,
  content,
  onAddToCalendar,
  topic,
}: {
  platform: "linkedin" | "tiktok" | "facebook";
  content: string;
  onAddToCalendar: (platform: "linkedin" | "tiktok" | "facebook", content: string) => void;
  topic: string;
}) {
  const cfg = PLATFORM_CONFIG[platform];
  const { displayed } = useTypewriter(content, 6);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="platform-card flex flex-col h-full relative overflow-hidden"
      style={{ borderTop: `2px solid ${cfg.color}`, background: cfg.dimColor }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div>
          <div className="font-display text-base font-bold" style={{ color: cfg.color }}>
            {cfg.label}
          </div>
          <div className="font-mono text-[9px] text-white/30 tracking-widest mt-0.5">{cfg.tag}</div>
        </div>
        <div className="font-mono text-[9px] text-white/20 text-right hidden lg:block">
          {cfg.format}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {content ? (
          <div className="font-mono text-xs text-white/70 leading-relaxed whitespace-pre-wrap">
            {displayed}
            {displayed.length < content.length && (
              <span className="inline-block w-1.5 h-3 bg-amber-400 animate-pulse ml-0.5 align-middle" />
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <span className="font-mono text-[10px] text-white/15 tracking-widest">AWAITING GENERATION</span>
          </div>
        )}
      </div>

      {/* Footer actions */}
      {content && (
        <div className="flex gap-2 p-3 border-t border-white/5">
          <button
            onClick={handleCopy}
            className="flex-1 font-mono text-[10px] py-1.5 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all tracking-widest"
          >
            {copied ? "✓ COPIED" : "COPY"}
          </button>
          <button
            onClick={() => onAddToCalendar(platform, content)}
            className="flex-1 font-mono text-[10px] py-1.5 transition-all tracking-widest"
            style={{ background: cfg.color + "20", color: cfg.color, border: `1px solid ${cfg.color}40` }}
          >
            + CALENDAR
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CALENDAR VIEW
// ============================================================
function CalendarView({
  entries,
  onRemove,
  onStatusChange,
}: {
  entries: CalendarEntry[];
  onRemove: (id: string) => void;
  onStatusChange: (id: string, status: CalendarEntry["status"]) => void;
}) {
  const STATUS_COLORS = {
    draft: "#F5A623",
    scheduled: "#0A66C2",
    published: "#22C55E",
  };

  return (
    <div className="grid grid-cols-7 gap-[1px] bg-white/5 border border-white/10">
      {/* Day headers */}
      {DAYS.map((d) => (
        <div key={d} className="bg-[#0D0D0B] px-2 py-2 text-center">
          <span className="font-mono text-[9px] text-white/30 tracking-[0.2em]">{d}</span>
        </div>
      ))}

      {/* Day cells */}
      {DAYS.map((day, idx) => {
        const dayEntries = entries.filter((_, i) => i % 7 === idx);
        return (
          <div key={day} className="bg-[#0D0D0B] min-h-[140px] p-2 flex flex-col gap-1.5">
            {dayEntries.map((entry) => {
              const cfg = PLATFORM_CONFIG[entry.platform];
              return (
                <div
                  key={entry.id}
                  className="calendar-entry p-2 relative group"
                  style={{ borderLeft: `2px solid ${cfg.color}`, background: cfg.dimColor }}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <div className="font-mono text-[9px] font-bold" style={{ color: cfg.color }}>
                        {cfg.label.toUpperCase()}
                      </div>
                      <div className="font-mono text-[9px] text-white/50 mt-0.5 line-clamp-2">
                        {entry.topic}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemove(entry.id)}
                      className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all text-[10px] shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="mt-1.5">
                    <select
                      value={entry.status}
                      onChange={(e) => onStatusChange(entry.id, e.target.value as CalendarEntry["status"])}
                      className="w-full font-mono text-[8px] tracking-widest bg-transparent border-none outline-none cursor-pointer"
                      style={{ color: STATUS_COLORS[entry.status] }}
                    >
                      <option value="draft">● DRAFT</option>
                      <option value="scheduled">● SCHEDULED</option>
                      <option value="published">● PUBLISHED</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function ContentFlowPage() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");

  // Step 1: Brand Voice
  const [brand, setBrand] = useState("");
  const [industry, setIndustry] = useState("");
  const [market, setMarket] = useState("North America");
  const [goal, setGoal] = useState("brand awareness");
  const [keywords, setKeywords] = useState("");
  const [voiceTone, setVoiceTone] = useState("");

  // Step 2: Topics
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  // Step 3: Content
  const [platformContent, setPlatformContent] = useState<PlatformContent>({
    linkedin: "",
    tiktok: "",
    facebook: "",
  });

  // Step 4: Calendar
  const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>([]);

  // Load calendar from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("contentflow_calendar");
    if (saved) {
      try { setCalendarEntries(JSON.parse(saved)); } catch {}
    }
  }, []);

  const saveCalendar = (entries: CalendarEntry[]) => {
    setCalendarEntries(entries);
    localStorage.setItem("contentflow_calendar", JSON.stringify(entries));
  };

  // ── Step 1 → 2: Generate Topics ──
  const generateTopics = async () => {
    if (!brand || !industry) { setError("Brand name and industry are required."); return; }
    setError("");
    setLoading(true);
    setLoadingMsg("SCANNING GLOBAL TRENDS · ANALYZING PLATFORM SIGNALS");

    const prompt = `
You are a senior social media strategist specializing in international brand growth.

Based on the following brand profile, generate 5 content topic ideas optimized for LinkedIn, TikTok, and Facebook.

Brand: ${brand}
Industry: ${industry}
Target Market: ${market}
Content Goal: ${goal}
Brand Keywords: ${keywords}
Voice/Tone: ${voiceTone}

Requirements:
- Draw from the LATEST trending content formats and topics in 2025-2026 for each platform
- Each topic must have a distinct angle (trend, behind-the-scenes, social proof, education, controversy)
- Topics must feel platform-native, not generic
- Consider current algorithm preferences: LinkedIn rewards personal insight, TikTok rewards pattern interrupts, Facebook rewards emotional resonance

Return ONLY a valid JSON array, no markdown, no explanation:
[
  {
    "title": "Topic title (max 10 words)",
    "angle": "One sentence explaining the content angle",
    "platform_fit": "Which platform this works best on and why (1 sentence)"
  }
]
    `;

    try {
      const raw = await callGemini(prompt);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed: Topic[] = JSON.parse(clean);
      setTopics(parsed);
      setStep(2);
    } catch (e: any) {
      setError(e.message || "Failed to generate topics.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2 → 3: Generate Platform Content ──
  const generateContent = async () => {
    if (!selectedTopic) { setError("Select a topic first."); return; }
    setError("");
    setLoading(true);
    setLoadingMsg("GENERATING PLATFORM-NATIVE CONTENT · OPTIMIZING VOICE");
    setPlatformContent({ linkedin: "", tiktok: "", facebook: "" });

    const basePrompt = `
Brand: ${brand} | Industry: ${industry} | Market: ${market}
Brand Voice: ${voiceTone || "Professional yet approachable"}
Mandatory Keywords: ${keywords}
Topic: ${selectedTopic.title}
Angle: ${selectedTopic.angle}
`;

    try {
      // Generate all 3 in parallel
      const [li, tt, fb] = await Promise.all([
        callGemini(`${basePrompt}
Write a LinkedIn post. Requirements:
- 300-500 words
- Professional, insight-driven tone
- Start with a bold first line (no "I" as first word)
- Include 3-5 relevant hashtags at the end
- End with a clear CTA question to drive comments
- Reference current 2025-2026 industry trends
- NO emojis except sparingly in hashtags`),

        callGemini(`${basePrompt}
Write a TikTok video script. Requirements:
- 15-30 second spoken script
- First 3 seconds must be a pattern-interrupt HOOK (question, shocking stat, or bold statement)
- Write exactly what to say out loud, word for word
- Include [VISUAL CUE] directions in brackets
- End with a verbal CTA
- Add 5 trending hashtags for caption
- Conversational, energetic, Gen-Z friendly tone`),

        callGemini(`${basePrompt}
Write a Facebook post optimized for both organic reach and paid advertising. Requirements:
- 150-250 words
- Emotionally resonant opening
- Tell a micro-story or use social proof
- Include a clear value proposition
- End with a direct CTA (link in bio, comment below, etc.)
- 3-5 hashtags
- Suitable for boosting as a Facebook Ad`),
      ]);

      setPlatformContent({ linkedin: li, tiktok: tt, facebook: fb });
      setStep(3);
    } catch (e: any) {
      setError(e.message || "Failed to generate content.");
    } finally {
      setLoading(false);
    }
  };

  // ── Add to Calendar ──
  const addToCalendar = (
    platform: "linkedin" | "tiktok" | "facebook",
    content: string
  ) => {
    const entry: CalendarEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      platform,
      topic: selectedTopic?.title || "Untitled",
      content,
      status: "draft",
    };
    const updated = [...calendarEntries, entry];
    saveCalendar(updated);
    setStep(4);
  };

  const removeEntry = (id: string) => {
    saveCalendar(calendarEntries.filter((e) => e.id !== id));
  };

  const updateStatus = (id: string, status: CalendarEntry["status"]) => {
    saveCalendar(
      calendarEntries.map((e) => (e.id === id ? { ...e, status } : e))
    );
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="cf-root">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        :root {
          --amber: #F5A623;
          --amber-dim: #F5A62320;
          --bg: #0D0D0B;
          --surface: #111110;
          --border: rgba(255,255,255,0.06);
          --text: rgba(255,255,255,0.85);
          --muted: rgba(255,255,255,0.25);
        }

        .cf-root {
          min-height: 100vh;
          background-color: var(--bg);
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 40px 40px;
          color: var(--text);
          font-family: 'DM Mono', monospace;
          cursor: crosshair;
        }

        .font-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.05em; }
        .font-mono { font-family: 'DM Mono', monospace; }

        /* Ticker */
        .ticker-wrap { overflow: hidden; width: 100%; }
        .ticker-move {
          display: inline-block;
          animation: ticker-scroll 40s linear infinite;
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Input styles */
        .cf-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.85);
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          padding: 8px 0;
          outline: none;
          transition: border-color 0.2s;
        }
        .cf-input:focus { border-bottom-color: var(--amber); }
        .cf-input::placeholder { color: rgba(255,255,255,0.15); }

        .cf-select {
          width: 100%;
          background: #111110;
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.85);
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          padding: 8px 10px;
          outline: none;
          cursor: pointer;
        }
        .cf-select:focus { border-color: var(--amber); }
        .cf-select option { background: #111110; }

        /* Buttons */
        .cf-btn-primary {
          background: var(--amber);
          color: #000;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 0.1em;
          padding: 12px 32px;
          border: none;
          cursor: crosshair;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .cf-btn-primary:hover { background: #fff; transform: translate(-2px, -2px); box-shadow: 4px 4px 0 var(--amber); }
        .cf-btn-primary:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }

        .cf-btn-ghost {
          background: transparent;
          color: rgba(255,255,255,0.4);
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          padding: 8px 16px;
          border: 1px solid rgba(255,255,255,0.1);
          cursor: crosshair;
          transition: all 0.2s;
          text-transform: uppercase;
        }
        .cf-btn-ghost:hover { color: #fff; border-color: rgba(255,255,255,0.3); }

        /* Topic card */
        .topic-card {
          border: 1px solid rgba(255,255,255,0.06);
          padding: 16px;
          cursor: crosshair;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .topic-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: var(--amber);
          transform: scaleY(0);
          transition: transform 0.2s;
        }
        .topic-card:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.02); }
        .topic-card:hover::before { transform: scaleY(1); }
        .topic-card.selected { border-color: var(--amber); background: rgba(245,166,35,0.05); }
        .topic-card.selected::before { transform: scaleY(1); }

        /* Platform card */
        .platform-card {
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          transition: all 0.3s;
          animation: fadeInUp 0.4s ease both;
        }
        .platform-card:nth-child(1) { animation-delay: 0.05s; }
        .platform-card:nth-child(2) { animation-delay: 0.15s; }
        .platform-card:nth-child(3) { animation-delay: 0.25s; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Calendar */
        .calendar-entry {
          transition: all 0.15s;
        }
        .calendar-entry:hover { filter: brightness(1.3); }

        /* Loading overlay */
        .loading-overlay {
          position: fixed;
          inset: 0;
          background: rgba(13,13,11,0.92);
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }

        .loading-bar {
          width: 240px;
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin-top: 24px;
          position: relative;
          overflow: hidden;
        }
        .loading-bar::after {
          content: '';
          position: absolute;
          left: -100%;
          top: 0;
          width: 100%;
          height: 100%;
          background: var(--amber);
          animation: loading-sweep 1.2s ease-in-out infinite;
        }
        @keyframes loading-sweep {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        /* Section label */
        .section-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(245,166,35,0.3); }

        a { cursor: crosshair !important; }
        button { cursor: crosshair !important; }
        select { cursor: crosshair !important; }
      `}</style>

      {/* ── Loading Overlay ── */}
      {loading && (
        <div className="loading-overlay">
          <div className="font-display text-5xl text-amber-400 tracking-widest animate-pulse">
            PROCESSING
          </div>
          <div className="font-mono text-[10px] text-white/30 tracking-[0.3em] mt-4 text-center px-8">
            {loadingMsg}
          </div>
          <div className="loading-bar" />
          <div className="font-mono text-[9px] text-amber-400/40 mt-6 tracking-widest">
            GEMINI 2.5 FLASH · ACTIVE
          </div>
        </div>
      )}

      {/* ── Top Nav ── */}
      <nav className="border-b border-white/5 px-6 py-3 flex items-center justify-between bg-[#0D0D0B]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-mono text-[10px] text-white/30 hover:text-white transition-colors tracking-widest uppercase flex items-center gap-2">
            ← BACK
          </Link>
          <div className="w-[1px] h-4 bg-white/10" />
          <div className="font-display text-xl text-amber-400 tracking-widest">CONTENTFLOW</div>
          <div className="font-mono text-[9px] text-white/20 tracking-widest hidden md:block">
            SOCIAL MEDIA COMMAND CENTER
          </div>
        </div>
        <StepIndicator current={step} />
      </nav>

      {/* ── Ticker ── */}
      <div className="border-b border-white/5 py-1.5 px-4 bg-black/40">
        <Ticker />
      </div>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 border border-red-800 bg-red-900/10 font-mono text-xs text-red-400 tracking-widest flex items-center justify-between">
            <span>⚠ {error}</span>
            <button onClick={() => setError("")} className="text-red-400/50 hover:text-red-400">✕</button>
          </div>
        )}

        {/* ════════════════════════════════════
            STEP 1: BRAND VOICE
        ════════════════════════════════════ */}
        {step === 1 && (
          <div className="animate-[fadeInUp_0.4s_ease_both]" style={{ animationName: 'fadeInUp' }}>
            <div className="mb-10">
              <div className="font-display text-6xl md:text-8xl text-white leading-none mb-2">
                BRAND<br />
                <span className="text-amber-400">VOICE</span>
              </div>
              <div className="font-mono text-[11px] text-white/25 tracking-[0.2em] uppercase">
                Configure your brand identity before generating content
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl">
              {/* Left column */}
              <div className="space-y-8">
                <div className="section-label">Brand Identity</div>

                <div>
                  <label className="font-mono text-[9px] text-white/30 tracking-[0.2em] uppercase block mb-2">
                    Brand Name *
                  </label>
                  <input
                    className="cf-input font-display text-2xl"
                    placeholder="YOUR BRAND"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] text-white/30 tracking-[0.2em] uppercase block mb-2">
                    Industry / Niche *
                  </label>
                  <input
                    className="cf-input"
                    placeholder="e.g. outdoor furniture, pet supplies, skincare"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] text-white/30 tracking-[0.2em] uppercase block mb-2">
                    Keywords to include
                  </label>
                  <input
                    className="cf-input"
                    placeholder="e.g. factory direct, eco-friendly, 5-year warranty"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-8">
                <div className="section-label">Content Strategy</div>

                <div>
                  <label className="font-mono text-[9px] text-white/30 tracking-[0.2em] uppercase block mb-2">
                    Target Market
                  </label>
                  <select className="cf-select" value={market} onChange={(e) => setMarket(e.target.value)}>
                    <option>North America</option>
                    <option>Europe</option>
                    <option>Southeast Asia</option>
                    <option>Middle East</option>
                    <option>Latin America</option>
                    <option>Global</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[9px] text-white/30 tracking-[0.2em] uppercase block mb-2">
                    Primary Goal
                  </label>
                  <select className="cf-select" value={goal} onChange={(e) => setGoal(e.target.value)}>
                    <option value="brand awareness">Brand Awareness</option>
                    <option value="lead generation">Lead Generation</option>
                    <option value="product launch">Product Launch</option>
                    <option value="community growth">Community Growth</option>
                    <option value="sales conversion">Sales Conversion</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[9px] text-white/30 tracking-[0.2em] uppercase block mb-2">
                    Brand Voice / Personality
                  </label>
                  <input
                    className="cf-input"
                    placeholder="e.g. bold and witty, professional and trustworthy"
                    value={voiceTone}
                    onChange={(e) => setVoiceTone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <button
                className="cf-btn-primary"
                onClick={generateTopics}
                disabled={!brand || !industry}
              >
                GENERATE TOPICS
                <span className="text-sm opacity-60">→</span>
              </button>
              <div className="font-mono text-[9px] text-white/20 tracking-widest">
                POWERED BY GEMINI 2.5 FLASH
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            STEP 2: TOPIC SELECTION
        ════════════════════════════════════ */}
        {step === 2 && (
          <div>
            <div className="flex items-start justify-between mb-10">
              <div>
                <div className="font-display text-6xl md:text-8xl text-white leading-none mb-2">
                  SELECT<br />
                  <span className="text-amber-400">TOPIC</span>
                </div>
                <div className="font-mono text-[11px] text-white/25 tracking-[0.2em] uppercase">
                  {brand} · {market} · {goal}
                </div>
              </div>
              <button className="cf-btn-ghost mt-4" onClick={() => setStep(1)}>
                ← RECONFIGURE
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 max-w-3xl mb-10">
              {topics.map((topic, i) => (
                <div
                  key={i}
                  className={`topic-card ${selectedTopic === topic ? "selected" : ""}`}
                  onClick={() => setSelectedTopic(topic)}
                >
                  <div className="flex items-start gap-4">
                    <div className="font-display text-3xl text-amber-400/30 leading-none shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1">
                      <div className="font-display text-xl text-white mb-1">{topic.title}</div>
                      <div className="font-mono text-[11px] text-white/40 leading-relaxed mb-2">
                        {topic.angle}
                      </div>
                      <div className="font-mono text-[9px] text-amber-400/60 tracking-widest">
                        ▸ {topic.platform_fit}
                      </div>
                    </div>
                    {selectedTopic === topic && (
                      <div className="font-mono text-[9px] text-amber-400 tracking-widest shrink-0 mt-1">
                        SELECTED ✓
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <button
                className="cf-btn-primary"
                onClick={generateContent}
                disabled={!selectedTopic}
              >
                GENERATE CONTENT
                <span className="text-sm opacity-60">→</span>
              </button>
              <button className="cf-btn-ghost" onClick={generateTopics}>
                ↺ REGENERATE
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            STEP 3: PLATFORM CONTENT
        ════════════════════════════════════ */}
        {step === 3 && (
          <div>
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="font-display text-6xl md:text-8xl text-white leading-none mb-2">
                  CONTENT<br />
                  <span className="text-amber-400">OUTPUT</span>
                </div>
                <div className="font-mono text-[11px] text-white/25 tracking-[0.15em] uppercase max-w-xl">
                  {selectedTopic?.title}
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button className="cf-btn-ghost" onClick={() => setStep(2)}>
                  ← TOPICS
                </button>
                <button className="cf-btn-ghost" onClick={generateContent}>
                  ↺ REGENERATE
                </button>
              </div>
            </div>

            {/* Three platform cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[1px] bg-white/5 min-h-[500px]">
              {(["linkedin", "tiktok", "facebook"] as const).map((p) => (
                <PlatformCard
                  key={p}
                  platform={p}
                  content={platformContent[p]}
                  topic={selectedTopic?.title || ""}
                  onAddToCalendar={addToCalendar}
                />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="font-mono text-[9px] text-white/20 tracking-widest">
                {Object.values(platformContent).filter(Boolean).length}/3 PLATFORMS GENERATED
              </div>
              <button
                className="cf-btn-primary"
                onClick={() => setStep(4)}
              >
                VIEW CALENDAR
                <span className="text-sm opacity-60">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            STEP 4: CALENDAR
        ════════════════════════════════════ */}
        {step === 4 && (
          <div>
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="font-display text-6xl md:text-8xl text-white leading-none mb-2">
                  CONTENT<br />
                  <span className="text-amber-400">CALENDAR</span>
                </div>
                <div className="font-mono text-[11px] text-white/25 tracking-[0.2em] uppercase">
                  {calendarEntries.length} ITEMS SCHEDULED · AUTO-SAVED
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button className="cf-btn-ghost" onClick={() => setStep(3)}>
                  ← CONTENT
                </button>
                <button
                  className="cf-btn-ghost"
                  onClick={() => { saveCalendar([]); }}
                  style={{ color: "rgba(255,80,80,0.4)", borderColor: "rgba(255,80,80,0.15)" }}
                >
                  CLEAR ALL
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-6 mb-6">
              {Object.entries(PLATFORM_CONFIG).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="w-3 h-3 shrink-0" style={{ background: cfg.color }} />
                  <span className="font-mono text-[9px] text-white/30 tracking-widest uppercase">{cfg.label}</span>
                </div>
              ))}
              <div className="ml-auto flex gap-4">
                {[
                  { s: "draft", color: "#F5A623", label: "DRAFT" },
                  { s: "scheduled", color: "#0A66C2", label: "SCHEDULED" },
                  { s: "published", color: "#22C55E", label: "PUBLISHED" },
                ].map((item) => (
                  <div key={item.s} className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
                    <span className="font-mono text-[9px]" style={{ color: item.color + "80" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {calendarEntries.length === 0 ? (
              <div className="border border-white/5 p-20 text-center">
                <div className="font-display text-4xl text-white/10 mb-3">CALENDAR EMPTY</div>
                <div className="font-mono text-[10px] text-white/15 tracking-widest mb-6">
                  Generate content and click + CALENDAR to schedule posts
                </div>
                <button className="cf-btn-ghost" onClick={() => setStep(1)}>
                  START NEW CAMPAIGN →
                </button>
              </div>
            ) : (
              <CalendarView
                entries={calendarEntries}
                onRemove={removeEntry}
                onStatusChange={updateStatus}
              />
            )}

            <div className="mt-8 flex justify-center">
              <button className="cf-btn-primary" onClick={() => setStep(1)}>
                NEW CAMPAIGN
                <span className="text-sm opacity-60">+</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── Bottom status bar ── */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/5 bg-[#0D0D0B]/90 backdrop-blur-sm px-6 py-2 flex items-center justify-between">
        <div className="font-mono text-[9px] text-white/15 tracking-widest">
          CONTENTFLOW V1.0 · {brand || "NO BRAND CONFIGURED"}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-[9px] text-white/20 tracking-widest">GEMINI CONNECTED</span>
          </div>
          <div className="font-mono text-[9px] text-white/15 tracking-widest">
            {calendarEntries.length} ITEMS IN CALENDAR
          </div>
        </div>
      </div>

      {/* Bottom padding for status bar */}
      <div className="h-10" />
    </div>
  );
}