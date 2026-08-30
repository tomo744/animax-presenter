export default function SavedGallery({ decks, onLoad, onDelete }) {
  return (
    <section className="gallery">
      <div className="preview-head">
        <h2>保存したスライド</h2>
        <p>このブラウザの localStorage に保存されます</p>
      </div>
      {decks.length === 0 ? (
        <p className="empty">まだ保存がありません。編集して「ローカルに保存」を押してください。</p>
      ) : (
        <ul className="gallery-list">
          {decks.map((item) => (
            <li key={item.id} className="gallery-card">
              <button type="button" className="gallery-main" onClick={() => onLoad(item)}>
                {item.posterUrl || item.posterDataUrl ? (
                  <img
                    src={item.posterDataUrl || item.posterUrl}
                    alt=""
                  />
                ) : (
                  <span className="gallery-ph" style={{ background: item.theme }} />
                )}
                <span>
                  <strong>{item.title}</strong>
                  <small>
                    {new Date(item.savedAt).toLocaleString('ja-JP')}
                  </small>
                </span>
              </button>
              <button
                type="button"
                className="btn ghost danger"
                onClick={() => onDelete(item.id)}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
