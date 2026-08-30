git commit -m "Fix CORS issue with poster image proxy"


git push origin main


import React from 'react';

export function EditorPanel({
  deck,
  onChange,
  onGenerateAi,
  isAiLoading,
  onSave,
  onDownloadAll,
  onDownloadSingle,
}) {
  // 画像ファイルをBase64に変換してセットする処理
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange({
        ...deck,
        posterDataUrl: reader.result,
        posterUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  // 画像を消去する処理
  const handleClearImage = () => {
    onChange({
      ...deck,
      posterDataUrl: '',
      posterUrl: '',
    });
  };

  const themes = ['#ff4d8d', '#4deeea', '#74ee15', '#ffe700', '#f368e0', '#ff9f43'];

  return (
    <div className="editor-panel">
      <div className="form-group">
        <label>アニメ作品名</label>
        <input
          type="text"
          value={deck.title || ''}
          onChange={(e) => onChange({ ...deck, title: e.target.value })}
          placeholder="例: 進撃の巨人"
        />
      </div>

      <div className="form-group">
        <label>背景ポスター画像（アップロード）</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ fontSize: '12px', color: '#fff' }}
          />
          {deck.posterDataUrl && (
            <button
              type="button"
              onClick={handleClearImage}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                background: '#444',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              画像を削除
            </button>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>1. ここが最高</label>
        <textarea
          value={deck.peak || ''}
          onChange={(e) => onChange({ ...deck, peak: e.target.value })}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>2. 推しキャラ / シーン</label>
        <textarea
          value={deck.oshi || ''}
          onChange={(e) => onChange({ ...deck, oshi: e.target.value })}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>3. 一言でいうと</label>
        <textarea
          value={deck.oneLiner || ''}
          onChange={(e) => onChange({ ...deck, oneLiner: e.target.value })}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>背景テーマ色</label>
        <div className="color-picker" style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          {themes.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange({ ...deck, theme: color })}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: color,
                border: deck.theme === color ? '2px solid #fff' : 'none',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </div>

      <div className="action-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        <button
          className="btn-primary"
          onClick={onGenerateAi}
          disabled={isAiLoading}
          style={{ padding: '10px', borderRadius: '20px', background: '#ff4d8d', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          {isAiLoading ? '生成中...' : 'AIで魅力を自動生成'}
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onSave}
            style={{ flex: 1, padding: '8px', borderRadius: '15px', background: '#333', color: '#fff', border: '1px solid #555', cursor: 'pointer' }}
          >
            ローカルに保存
          </button>
          <button
            onClick={onDownloadAll}
            style={{ flex: 1, padding: '8px', borderRadius: '15px', background: '#333', color: '#fff', border: '1px solid #555', cursor: 'pointer' }}
          >
            3枚を画像でダウンロード
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onDownloadSingle(1)}
            style={{ flex: 1, padding: '6px', borderRadius: '12px', background: '#222', color: '#aaa', border: '1px solid #444', cursor: 'pointer' }}
          >
            1枚目のみ
          </button>
          <button
            onClick={() => onDownloadSingle(2)}
            style={{ flex: 1, padding: '6px', borderRadius: '12px', background: '#222', color: '#aaa', border: '1px solid #444', cursor: 'pointer' }}
          >
            2枚目のみ
          </button>
          <button
            onClick={() => onDownloadSingle(3)}
            style={{ flex: 1, padding: '6px', borderRadius: '12px', background: '#222', color: '#aaa', border: '1px solid #444', cursor: 'pointer' }}
          >
            3枚目のみ
          </button>
        </div>
      </div>
    </div>
  );
}
