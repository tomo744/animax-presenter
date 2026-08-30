import { useRef, useState } from 'react';
import EditorPanel from './components/EditorPanel';
import SlidePreview from './components/SlidePreview';
import SavedGallery from './components/SavedGallery';
import { generateAppeal } from './lib/aiCopy';
import { posterToDataUrl, searchAnime } from './lib/jikan';
import { downloadAllSlides, downloadSlide } from './lib/exportSlides';
import { loadDecks, removeDeck, upsertDeck } from './lib/storage';

const EMPTY = {
  id: null,
  title: '',
  peak: '',
  oshi: '',
  oneLiner: '',
  theme: '#ff4d8d',
  posterUrl: '',
  posterDataUrl: '',
  malId: null,
  genres: [],
  synopsis: '',
  score: null,
};

function slug(title) {
  return (title || 'animax')
    .toLowerCase()
    .replace(/[^\w\u3040-\u30ff\u4e00-\u9fff]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'animax';
}

export default function App() {
  const [deck, setDeck] = useState(EMPTY);
  const [saved, setSaved] = useState(() => loadDecks());
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState('');
  const previewRef = useRef(null);


  function flash(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  }

  function onField(key, value) {
    setDeck((prev) => ({ ...prev, [key]: value }));
  }

  function onTitleChange(title) {
    setDeck((prev) => ({
      ...prev,
      title,
      malId: null,
    }));
  }

  async function onSelectAnime(item) {
    setDeck((prev) => ({
      ...prev,
      title: item.title,
      posterUrl: item.posterUrl,
      posterDataUrl: item.posterUrl,
      malId: item.malId,
      genres: item.genres,
      synopsis: item.synopsis,
      score: item.score,
    }));
    const dataUrl = await posterToDataUrl(item.posterUrl);
    setDeck((prev) =>
      prev.malId === item.malId
        ? { ...prev, posterDataUrl: dataUrl }
        : prev,
    );
  }

  async function onGenerate() {
    if (!deck.title.trim()) return;
    setGenerating(true);
    try {
      let meta = {
        title: deck.title,
        synopsis: deck.synopsis,
        genres: deck.genres,
        score: deck.score,
      };
      if (!deck.malId) {
        const hits = await searchAnime(deck.title);
        const first = hits[0];
        if (first) {
          meta = first;
          const dataUrl = await posterToDataUrl(first.posterUrl);
          setDeck((prev) => ({
            ...prev,
            posterUrl: first.posterUrl,
            posterDataUrl: dataUrl,
            malId: first.malId,
            genres: first.genres,
            synopsis: first.synopsis,
            score: first.score,
            title: prev.title.trim() ? prev.title : first.title,
          }));
        }
      }
      const copy = generateAppeal(meta);
      setDeck((prev) => ({ ...prev, ...copy }));
      flash('魅力ポイントを生成しました');
    } catch {
      const copy = generateAppeal({ title: deck.title });
      setDeck((prev) => ({ ...prev, ...copy }));
      flash('オフライン用テンプレで生成しました');
    } finally {
      setGenerating(false);
    }
  }

  function slideNodes() {
    return previewRef.current?.querySelectorAll('[data-slide-index]') ?? [];
  }

  async function onDownloadAll() {
    const nodes = [...slideNodes()];
    if (!nodes.length) return;
    setExporting(true);
    try {
      await downloadAllSlides(nodes, slug(deck.title));
      flash('画像をダウンロードしました');
    } catch {
      flash('書き出しに失敗しました（ポスターCORSの可能性）');
    } finally {
      setExporting(false);
    }
  }

  async function onDownloadOne(index) {
    const node = slideNodes()[index];
    if (!node) return;
    setExporting(true);
    try {
      await downloadSlide(node, `${slug(deck.title)}-0${index + 1}.png`);
      flash(`${index + 1}枚目をダウンロードしました`);
    } catch {
      flash('書き出しに失敗しました');
    } finally {
      setExporting(false);
    }
  }

  function onSave() {
    const record = {
      ...deck,
      id: deck.id || crypto.randomUUID(),
      savedAt: Date.now(),
    };
    setDeck(record);
    setSaved(upsertDeck(record));
    flash('このブラウザに保存しました');
  }

  function onLoad(item) {
    setDeck(item);
    flash('保存データを読み込みました');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function onDelete(id) {
    const next = removeDeck(id);
    setSaved(next);
    if (deck.id === id) {
      setDeck((prev) => ({ ...prev, id: null }));
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <p className="logo">ANIMAX PRESENTER</p>
        <h1>アニメ専用ショートスライド</h1>
        <p className="lead">
          作品名・3つの魅力・テーマ色を入れるだけで、シェア用カードがリアルタイムに完成します。
        </p>
      </header>

      <div className="layout">
        <EditorPanel
          deck={deck}
          onTitleChange={onTitleChange}
          onSelectAnime={onSelectAnime}
          onField={onField}
          onGenerate={onGenerate}
          generating={generating}
          onDownloadAll={onDownloadAll}
          onDownloadOne={onDownloadOne}
          onSave={onSave}
          exporting={exporting}
        />
        <SlidePreview ref={previewRef} deck={deck} />
      </div>

      <SavedGallery decks={saved} onLoad={onLoad} onDelete={onDelete} />

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
