export type Essay = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
};

export const essays: Essay[] = [
  {
    slug: "vibe-coding",
    title: "Vibe Coding 六个月：它是真实的生产力，但门槛不在你以为的地方",
    date: "2026-02-25",
  },
  {
    slug: "ai-journey",
    title: "我不是技术人，但我比大多数技术人更早想清楚了一件事",
    date: "2026-03-10",
  },
  {
    slug: "prompt-skill",
    title: "你没在用 AI，你在让 AI 哄你——以及如何真正让它为你工作",
    date: "2026-03-12",
  },
];

export function getLatestEssays(count: number): Essay[] {
  return [...essays]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, count);
}

export function getAllEssays(): Essay[] {
  return [...essays].sort((a, b) => (a.date < b.date ? 1 : -1));
}
