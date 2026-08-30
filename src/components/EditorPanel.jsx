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
  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
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

  const handleClearImage = () => {
    onChange({
      ...deck,
      posterDataUrl: '',
      posterUrl: '',
    });
  };

  const themes = ['#ff4d8d', '#4deeea', '#74ee15', '#ffe700', '#f368e0', '#ff9f43'];

  return (
    <div className="editor-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="form-group">
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>アニメ作品名</label>
        <input
          type="text"
          value={deck.title || ''}
          onChange={(e) => onChange({ ...deck, title: e.target.value })}
          placeholder="例: 進撃の巨人"
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', background: '#1e1e24', color: '#fff', boxSizing: 'border-box' }}
        />
      </div>

      <div className="form-group" style={{ background: '#181820', padding: '12px', borderRadius: '8px', border: '1px solid #333' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#ff4d8d', fontWeight: 'bold' }}>
          背景ポスター画像（アップロード）
        </label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ fontSize: '12px', color: '#ccc' }}
          />
          {(deck.posterDataUrl || deck.posterUrl) && (
            <button
              type="button"
              onClick={handleClearImage}
              style={{
                padding: '4px 10px',
                fontSize: '12px',
                background: '#e53e3e',
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
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>1. ここが最高</label>
        <textarea
          value={deck.peak || ''}
          onChange={(e) => onChange({ ...deck, peak: e.target.value })}
          rows={3}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', background: '#1e1e24', color: '#fff', boxSizing: 'border-box' }}
        />
      </div>

      <div className="form-group">
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>2. 推しキャラ / シーン</label>
        <textarea
          value={deck.oshi || ''}
          onChange={(e) => onChange({ ...deck, oshi: e.target.value })}
          rows={3}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', background: '#1e1e24', color: '#fff', boxSizing: 'border-box' }}
        />
      </div>

      <div className="form-group">
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>3. 一言でいうと</label>
        <textarea
          value={deck.oneLiner || ''}
          onChange={(e) => onChange({ ...deck, oneLiner: e.target.value })}
          rows={3}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', background: '#1e1e24', color: '#fff', boxSizing: 'border-box' }}
        />
      </div>

      <div className="form-group">
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>背景テーマ色</label>
        <div className="color-picker" style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          {themes.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange({ ...deck, theme: color })}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: color,
                border: deck.theme === color ? '3px solid #fff' : 'none',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </div>

      <div className="action-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
        <button
          type="button"
          className="btn-primary"
          onClick={onGenerateAi}
          disabled={isAiLoading}
          style={{ padding: '12px', borderRadius: '20px', background: '#ff4d8d', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {isAiLoading ? '生成中...' : 'AIで魅力を自動生成'}
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={onSave}
            style={{ flex: 1, padding: '10px', borderRadius: '12px', background: '#2a2a32', color: '#fff', border: '1px solid #444', cursor: 'pointer' }}
          >
            ローカルに保存
          </button>
          <button
            type="button"
            onClick={onDownloadAll}
            style={{ flex: 1, padding: '10px', borderRadius: '12px', background: '#2a2a32', color: '#fff', border: '1px solid #444', cursor: 'pointer' }}
          >
            3枚を画像でダウンロード
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => onDownloadSingle(1)}
            style={{ flex: 1, padding: '8px', borderRadius: '8px', background: '#1a1a20', color: '#aaa', border: '1px solid #333', cursor: 'pointer' }}
          >
            1枚目のみ
          </button>
          <button
            type="button"
            onClick={() => onDownloadSingle(2)}
            style={{ flex: 1, padding: '8px', borderRadius: '8px', background: '#1a1a20', color: '#aaa', border: '1px solid #333', cursor: 'pointer' }}
          >
            2枚目のみ
          </button>
          <button
            type="button"
            onClick={() => onDownloadSingle(3)}
            style={{ flex: 1, padding: '8px', borderRadius: '8px', background: '#1a1a20', color: '#aaa', border: '1px solid #333', cursor: 'pointer' }}
          >
            3枚目のみ
          </button>
        </div>
      </div>
    </div>
  );
}
