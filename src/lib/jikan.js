// CORS制限を回避してポスター画像をBase64形式に変換する関数
export async function posterToDataUrl(url) {
  if (!url) return '';
  try {
    // プロキシを経由させてCORSエラーを回避
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error('Poster convert failed:', e);
    return '';
  }
}

export async function searchAnime(query) {
  if (!query) return [];
  const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=3`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('API Error');
  }
  const json = await res.json();
  const list = json.data || [];

  // 各アニメのポスター画像をCORS対応形式に変換して渡す
  const formatted = await Promise.all(
    list.map(async (item) => {
      const origPoster = item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || '';
      const dataUrl = await posterToDataUrl(origPoster);
      return {
        id: item.mal_id,
        title: item.title_japanese || item.title,
        posterUrl: origPoster,
        posterDataUrl: dataUrl || origPoster,
        score: item.score,
        synopsis: item.synopsis,
      };
    })
  );

  return formatted;
}

