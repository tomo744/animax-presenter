const BASE = 'https://api.jikan.moe/v4';

async function fetchJson(url, attempts = 3) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url);
      if (res.status === 429 || res.status >= 500) {
        lastError = new Error(`Jikan API error: ${res.status}`);
        await wait(400 * (i + 1));
        continue;
      }
      if (!res.ok) {
        throw new Error(`Jikan API error: ${res.status}`);
      }
      return res.json();
    } catch (err) {
      lastError = err;
      await wait(400 * (i + 1));
    }
  }
  throw lastError;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function searchAnime(query) {
  const q = query.trim();
  if (q.length < 1) return [];

  const url = `${BASE}/anime?q=${encodeURIComponent(q)}&limit=8&sfw=true`;
  const json = await fetchJson(url);
  return (json.data ?? []).map((item) => ({
    malId: item.mal_id,
    title: item.title_japanese || item.title,
    titleEnglish: item.title_english || item.title,
    titleRaw: item.title,
    year: item.year || item.aired?.prop?.from?.year || null,
    score: item.score,
    synopsis: item.synopsis || '',
    genres: (item.genres ?? []).map((g) => g.name),
    posterUrl:
      item.images?.jpg?.large_image_url ||
      item.images?.jpg?.image_url ||
      '',
  }));
}

/** MAL CDN は canvas CORS で失敗しやすいため、書き出し用に data URL 化する */
export async function posterToDataUrl(posterUrl) {
  if (!posterUrl) return '';
  const stripped = posterUrl.replace(/^https?:\/\//, '');
  const proxy = `https://wsrv.nl/?url=${encodeURIComponent(stripped)}&w=720&output=jpg`;
  try {
    const res = await fetch(proxy);
    if (!res.ok) return posterUrl;
    const blob = await res.blob();
    return await blobToDataUrl(blob);
  } catch {
    return posterUrl;
  }
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
