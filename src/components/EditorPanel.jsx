import TitleSearch from './TitleSearch';
import { THEME_PRESETS } from '../lib/themePresets';

export default function EditorPanel({
  deck,
  onTitleChange,
  onSelectAnime,
  onField,
  onGenerate,
  generating,
  onDownloadAll,
  onDownloadOne,
  onSave,
  exporting,
}) {
  return (
    <form className="editor" onSubmit={(e) => e.preventDefault()}>
      <TitleSearch
        title={deck.title}
        onTitleChange={onTitleChange}
        onSelectAnime={onSelectAnime}
        disabled={generating}
      />

      <div className="field">
        <label htmlFor="peak">1. ここが最高</label>
        <textarea
          id="peak"
          rows={3}
          maxLength={180}
          placeholder="演出、世界観、展開…"
          value={deck.peak}
          onChange={(e) => onField('peak', e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="oshi">2. 推しキャラ / シーン</label>
        <textarea
          id="oshi"
          rows={3}
          maxLength={180}
          placeholder="心を奪われたキャラやカット"
          value={deck.oshi}
          onChange={(e) => onField('oshi', e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="oneLiner">3. 一言でいうと</label>
        <textarea
          id="oneLiner"
          rows={2}
          maxLength={80}
          placeholder="短いキャッチコピー"
          value={deck.oneLiner}
          onChange={(e) => onField('oneLiner', e.target.value)}
        />
      </div>

      <div className="field">
        <span className="label-like">背景テーマ色</span>
        <div className="theme-row">
          {THEME_PRESETS.map((hex) => (
            <button
              key={hex}
              type="button"
              className={`swatch ${deck.theme === hex ? 'is-on' : ''}`}
              style={{ '--sw': hex }}
              aria-label={hex}
              onClick={() => onField('theme', hex)}
            />
          ))}
          <label className="custom-color">
            <input
              type="color"
              value={deck.theme}
              onChange={(e) => onField('theme', e.target.value)}
            />
            <span>カスタム</span>
          </label>
        </div>
      </div>

      <div className="actions">
        <button
          type="button"
          className="btn primary"
          onClick={onGenerate}
          disabled={generating || !deck.title.trim()}
        >
          {generating ? '生成中…' : 'AIで魅力を自動生成'}
        </button>
        <button
          type="button"
          className="btn"
          onClick={onSave}
          disabled={!deck.title.trim()}
        >
          ローカルに保存
        </button>
        <button
          type="button"
          className="btn"
          onClick={onDownloadAll}
          disabled={exporting}
        >
          {exporting ? '書き出し中…' : '3枚を画像でダウンロード'}
        </button>
      </div>
      <div className="actions sub">
        <button type="button" className="btn ghost" onClick={() => onDownloadOne(0)}>
          1枚目のみ
        </button>
        <button type="button" className="btn ghost" onClick={() => onDownloadOne(1)}>
          2枚目のみ
        </button>
        <button type="button" className="btn ghost" onClick={() => onDownloadOne(2)}>
          3枚目のみ
        </button>
      </div>
    </form>
  );
}
