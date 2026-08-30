import { useEffect, useState } from 'react';
import { searchAnime } from '../lib/jikan';

export function useJikanSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const q = query.trim();

    if (q.length < 1) {
      setResults([]);
      setError('');
      setLoading(false);
      setSearched(false);
      return undefined;
    }

    // 1. キャッシュ確認用のキーを作成
    const cacheKey = `animax_jikan_cache_${q.toLowerCase()}`;
    const cachedData = localStorage.getItem(cacheKey);

    // キャッシュが存在すればAPIを呼ぶ必要がないため、即座にそれをセットして終了
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setResults(parsed);
        setError('');
        setLoading(false);
        setSearched(true);
        return undefined;
      } catch (e) {
        // パースエラーが起きた場合はキャッシュを無視してAPI取得に進む
        localStorage.removeItem(cacheKey);
      }
    }

    setLoading(true);
    setError('');
    setSearched(false);

    // 2. 入力完了を待つデバウンス時間を 700ms に拡大してリクエスト頻度を抑制
    const timer = setTimeout(async () => {
      try {
        const data = await searchAnime(q);
        setResults(data);

        // 取得成功時は localStorage に結果を保存（次回以降は一瞬で読み込み）
        if (data && data.length > 0) {
          localStorage.setItem(cacheKey, JSON.stringify(data));
        }
      } catch (err) {
        setResults([]);
        setError('検索サーバーが混み合っています。少し待って再入力してください。');
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading, error, searched };
}
