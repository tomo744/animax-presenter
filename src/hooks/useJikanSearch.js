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

    setLoading(true);
    setError('');
    setSearched(false);

    const timer = setTimeout(async () => {
      try {
        const data = await searchAnime(q);
        setResults(data);
      } catch (err) {
        setResults([]);
        setError('検索サーバーが混み合っています。少し待って再入力してください。');
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading, error, searched };
}
