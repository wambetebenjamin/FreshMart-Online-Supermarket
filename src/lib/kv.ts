/**
 * Storage abstraction.
 *
 * - On Vercel with Vercel KV (Upstash REST env vars KV_REST_API_URL +
 *   KV_REST_API_TOKEN configured) data is persisted to KV over plain fetch —
 *   no extra dependency required.
 * - Everywhere else (local dev, preview without KV) an in-memory store is
 *   used so every API route works out of the box.
 */

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const useKV = Boolean(KV_URL && KV_TOKEN);

/* --------------------------- in-memory fallback --------------------- */

const memory = new Map<string, string>();

/* ------------------------------ REST client ------------------------- */

async function kvCommand(path: string, body?: string): Promise<string | null> {
  try {
    const res = await fetch(`${KV_URL}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        "Content-Type": "text/plain",
      },
      body: body ?? "",
      cache: "no-store",
    });
    if (!res.ok) return null;
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      return json.result ?? null;
    } catch {
      return text;
    }
  } catch {
    return null;
  }
}

/* --------------------------------- API ------------------------------ */

export async function kvGet(key: string): Promise<string | null> {
  if (useKV) return kvCommand(`/get/${encodeURIComponent(key)}`);
  return memory.get(key) ?? null;
}

export async function kvSet(key: string, value: string): Promise<void> {
  if (useKV) {
    await kvCommand(`/set/${encodeURIComponent(key)}`, value);
    return;
  }
  memory.set(key, value);
}

/** Append a value to a JSON array stored under `key` (bounded to last 500). */
export async function kvAppendToList(key: string, value: unknown): Promise<void> {
  const raw = await kvGet(key);
  let list: unknown[] = [];
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) list = parsed;
    } catch {
      list = [];
    }
  }
  list.push(value);
  if (list.length > 500) list = list.slice(-500);
  await kvSet(key, JSON.stringify(list));
}

export function storageBackend(): "vercel-kv" | "in-memory" {
  return useKV ? "vercel-kv" : "in-memory";
}
