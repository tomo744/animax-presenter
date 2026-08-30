import { useEffect, useRef, useState } from 'react';
import { useJikanSearch } from '../hooks/useJikanSearch';

export default function TitleSearch({
  title,
  onTitleChange,
  onSelectAnime,
  disabled,
}) {
  const { results, loading, error, searched } = useJikanSearch(title);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!boxRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const show = open && title.trim().length > 0;

  return (
    <div className="field" ref={boxRef}>
      <label htmlFor="anime-title">アニメ作品名</label>
      <input
        id="anime-title"
        type="text"
        autoComplete="off"
        placeholder="例: 鬼滅の刃 / Frieren"
        value={title}
        disabled={disabled}
        onChange={(e) => {
          setOpen(true);
          onTitleChange(e.target.value);
        }}
        onFocus={() => setOpen(true)}
      />
      {show && (
        <ul className="suggest" role="listbox">
          {loading && <li className="suggest-status">Jikan で検索中…</li>}
          {error && <li className="suggest-status error">{error}</li>}
          {!loading &&
            results.map((item) => (
              <li key={item.malId}>
                <button
                  type="button"
                  className="suggest-item"
                  onClick={() => {
                    onSelectAnime(item);
                    setOpen(false);
                  }}
                >
                  {item.posterUrl ? (
                    <img src={item.posterUrl} alt="" />
                  ) : (
                    <span className="suggest-ph" />
                  )}
                  <span>
                    <strong>{item.title}</strong>
                    <small>
                      {item.titleEnglish}
                      {item.year ? ` · ${item.year}` : ''}
                      {item.score ? ` · ★${item.score}` : ''}
                    </small>
                  </span>
                </button>
              </li>
            ))}
          {!loading && searched && !error && results.length === 0 && (
            <li className="suggest-status">候補なし。タイトルを直接入力できます</li>
          )}
        </ul>
      )}
    </div>
  );
}
