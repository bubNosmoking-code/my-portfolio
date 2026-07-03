import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllEssays } from "./data";

export const metadata = {
  title: "Works & Thoughts — Archive",
};

export default function WorksArchive() {
  const essays = getAllEssays();

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#111111] font-serif selection:bg-black selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=JetBrains+Mono:wght@400&family=Playfair+Display:ital,wght@0,400;0,600;0,900;1,400&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        * { border-radius: 0px !important; }
        body { font-family: 'Lora', serif; }
        .font-headline { font-family: 'Playfair Display', serif; }
        .font-mono-data { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <nav className="sticky top-0 z-50 border-b border-black bg-[#F9F9F7] px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-headline font-bold text-xl tracking-tight">BN.</Link>
        <Link href="/" className="font-mono-data text-xs uppercase tracking-widest flex items-center gap-1 hover:text-[#CC0000]">
          <ArrowLeft size={12} />
          Back to Home
        </Link>
      </nav>

      <div className="max-w-screen-xl mx-auto border-x border-black min-h-screen">
        <header className="border-b-4 border-black py-12 md:py-20 text-center px-4">
          <div className="font-mono-data text-xs uppercase tracking-widest text-[#CC0000] mb-4">Archive</div>
          <h1 className="font-headline text-4xl md:text-6xl font-black tracking-tighter">
            Works &amp; Thoughts
          </h1>
          <p className="mt-4 font-mono-data text-xs uppercase tracking-widest text-neutral-500">
            {essays.length} {essays.length === 1 ? "Article" : "Articles"} &bull; All Time
          </p>
        </header>

        <section className="bg-white">
          {essays.map((essay, i) => (
            <Link
              key={essay.slug}
              href={`/works/${essay.slug}`}
              className="group flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 border-b border-black hover:bg-neutral-100 transition-colors"
            >
              <div className="flex items-start md:items-center gap-4 mb-2 md:mb-0">
                <span className="font-mono-data text-xs text-black/30 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <span className="font-mono-data text-xs text-[#CC0000] mr-2">ESSAY</span>
                  <h4 className="font-headline text-xl md:text-2xl font-bold inline group-hover:underline decoration-[#CC0000] underline-offset-4">
                    {essay.title}
                  </h4>
                </div>
              </div>
              <span className="font-mono-data text-xs text-neutral-500 shrink-0 ml-10 md:ml-4">{essay.date}</span>
            </Link>
          ))}
        </section>

        <footer className="border-t-4 border-black p-8 text-center">
          <p className="font-mono-data text-xs text-neutral-400 uppercase tracking-widest">© 2026 bubNosmoking. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
