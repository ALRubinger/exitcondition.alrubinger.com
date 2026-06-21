import { promises as fs } from 'node:fs';
import path from 'node:path';

export interface TweetData {
  id: string;
  url: string;
  text: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  createdAt: string;
  likes: number;
  replies: number;
}

// Anchor to the project root (process.cwd()) so the cache survives
// `dist/` rebuilds. import.meta.url would resolve relative to the
// compiled module's location, which Vite emits inside dist/ during
// the static build.
const CACHE_DIR = path.join(process.cwd(), '.astro', 'tweet-cache');

const memCache = new Map<string, TweetData>();

export function parseTweetId(input: string): string {
  if (/^\d+$/.test(input.trim())) return input.trim();
  const m = input.match(/status(?:es)?\/(\d+)/);
  if (m) return m[1];
  throw new Error(
    `Could not extract a tweet ID from "${input}". ` +
      `Pass a full URL like https://x.com/<handle>/status/<id> or the ID itself.`,
  );
}

// Token derivation used by X's own embed widget. The syndication
// endpoint requires it; without it the request returns an HTML error
// page rather than JSON. Identical to the algorithm in Vercel's
// react-tweet — base-36 of (id / 1e15 * π) with zeros and the dot
// removed.
function deriveToken(id: string): string {
  return ((Number(id) / 1e15) * Math.PI)
    .toString(36)
    .replace(/(0+|\.)/g, '');
}

async function readDiskCache(id: string): Promise<TweetData | null> {
  try {
    const raw = await fs.readFile(
      path.join(CACHE_DIR, `${id}.json`),
      'utf-8',
    );
    return JSON.parse(raw) as TweetData;
  } catch {
    return null;
  }
}

async function writeDiskCache(id: string, data: TweetData): Promise<void> {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(
    path.join(CACHE_DIR, `${id}.json`),
    JSON.stringify(data, null, 2),
    'utf-8',
  );
}

interface SyndicationResponse {
  text?: string;
  created_at?: string;
  favorite_count?: number;
  conversation_count?: number;
  display_text_range?: [number, number];
  user?: {
    name?: string;
    screen_name?: string;
    profile_image_url_https?: string;
    verified?: boolean;
  };
}

export async function fetchTweet(input: string): Promise<TweetData> {
  const id = parseTweetId(input);

  const cached = memCache.get(id);
  if (cached) return cached;

  const disk = await readDiskCache(id);
  if (disk) {
    memCache.set(id, disk);
    return disk;
  }

  const token = deriveToken(id);
  const endpoint =
    `https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=${token}`;

  const res = await fetch(endpoint, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'exitcondition.alrubinger.com (tweet-embed)',
    },
  });

  if (!res.ok) {
    throw new Error(
      `Tweet ${id} fetch failed (${res.status} ${res.statusText}). ` +
        `The tweet may have been deleted, the account protected, or ` +
        `the X syndication endpoint may be rate-limiting.`,
    );
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error(
      `Tweet ${id} fetch returned non-JSON (likely deleted or ` +
        `protected). X serves an HTML error page in that case.`,
    );
  }

  const json = (await res.json()) as SyndicationResponse;
  if (!json?.text || !json?.user?.screen_name) {
    throw new Error(
      `Tweet ${id} response was missing required fields. ` +
        `The syndication endpoint may have changed shape.`,
    );
  }

  // display_text_range is the byte range X considers the user-facing
  // tweet text — strips trailing media URLs and quoted-tweet links.
  // When absent, fall back to the full text.
  const range = json.display_text_range;
  const visibleText =
    range && range.length === 2
      ? Array.from(json.text)
          .slice(range[0], range[1])
          .join('')
      : json.text;

  const data: TweetData = {
    id,
    url: `https://x.com/${json.user.screen_name}/status/${id}`,
    text: visibleText.trim(),
    author: {
      name: json.user.name ?? json.user.screen_name,
      handle: json.user.screen_name,
      // _normal is the 48x48 thumbnail; _bigger (73x73) reads sharper
      // at the 48px display size on retina displays.
      avatar:
        json.user.profile_image_url_https?.replace(
          /_normal(\.[a-zA-Z]+)$/,
          '_bigger$1',
        ) ?? '',
      verified: Boolean(json.user.verified),
    },
    createdAt: json.created_at ?? new Date(0).toISOString(),
    likes: json.favorite_count ?? 0,
    replies: json.conversation_count ?? 0,
  };

  await writeDiskCache(id, data);
  memCache.set(id, data);
  return data;
}
