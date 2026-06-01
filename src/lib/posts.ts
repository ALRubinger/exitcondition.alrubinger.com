import { getCollection } from 'astro:content';

export type PostSummary = {
  slug: string;
  href: string;
  title: string;
  description?: string;
  date: Date;
};

export async function listPosts(): Promise<PostSummary[]> {
  const entries = await getCollection('posts', ({ data }) =>
    !import.meta.env.PROD || !data.draft,
  );
  return entries
    .map((entry) => ({
      slug: entry.id,
      href: `/posts/${entry.id}/`,
      title: entry.data.title,
      description: entry.data.description,
      date: entry.data.date,
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function formatDate(date: Date): string {
  // YAML date-only values (e.g. `2026-06-01`) parse as UTC midnight. Without
  // pinning timeZone to UTC here, toLocaleDateString shifts negative-UTC-offset
  // locales back one day ("May 31, 2026" for a 2026-06-01 post).
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
