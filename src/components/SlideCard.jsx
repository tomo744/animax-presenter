const SLIDES = [
  { key: 'peak', kicker: '01', label: 'ここが最高' },
  { key: 'oshi', kicker: '02', label: '推しキャラ / シーン' },
  { key: 'oneLiner', kicker: '03', label: '一言でいうと' },
];

export default function SlideCard({ slide, deck, index }) {
  const { kicker, label, key } = slide;
  const text = deck[key] || '（入力するとここに表示されます）';
  const poster = deck.posterDataUrl || deck.posterUrl;

  return (
    <article
      className={`slide-card slide-${index}`}
      style={{ '--theme': deck.theme }}
      data-slide-index={index}
    >
      <div className="slide-glow" />
      {poster && (
        <div
          className="slide-poster"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}
      <div className="slide-scrim" />
      <header className="slide-top">
        <span className="slide-brand">ANIMAX</span>
        <span className="slide-kicker">{kicker}</span>
      </header>
      <p className="slide-label">{label}</p>
      <h2 className="slide-title">{deck.title || 'Untitled Anime'}</h2>
      <p className={`slide-body ${key === 'oneLiner' ? 'is-quote' : ''}`}>{text}</p>
      <footer className="slide-foot">Animax Presenter</footer>
    </article>
  );
}

export { SLIDES };
