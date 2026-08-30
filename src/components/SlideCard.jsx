import React from 'react';

export function SlideCard({ cardRef, title, label, text, indexTotal, themeColor, posterUrl }) {
  const bgStyle = {
    position: 'relative',
    width: '100%',
    aspectRatio: '9 / 16',
    borderRadius: '16px',
    padding: '24px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: '#ffffff',
    overflow: 'hidden',
    backgroundColor: '#0a0a0c',
    boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
  };

  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    background: posterUrl
      ? `linear-gradient(to bottom, rgba(10,10,12,0.4) 0%, rgba(10,10,12,0.85) 60%, rgba(10,10,12,0.98) 100%), url(${posterUrl}) center/cover no-repeat`
      : `radial-gradient(circle at top right, ${themeColor}33, transparent 70%), linear-gradient(135deg, #181824 0%, #0a0a0c 100%)`,
    zIndex: 1,
  };

  return (
    <div ref={cardRef} style={bgStyle}>
      <div style={overlayStyle} />

      {/* ヘッダー情報 */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', tracking: '1.5px', color: 'rgba(255,255,255,0.6)' }}>
          ANIMAX
        </span>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'rgba(255,255,255,0.4)' }}>
          {indexTotal}
        </span>
      </div>

      {/* メインコンテンツ */}
      <div style={{ position: 'relative', zIndex: 2, margin: 'auto 0' }}>
        <div style={{ fontSize: '13px', color: themeColor || '#ff4d8d', fontWeight: '600', marginBottom: '8px' }}>
          {label}
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', lineHeight: '1.3' }}>
          {title || '作品タイトル'}
        </h2>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#e2e8f0', whiteSpace: 'pre-wrap' }}>
          {text || '魅力を入力してください'}
        </p>
      </div>

      {/* フッター情報 */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
          Animax Presenter
        </span>
      </div>
    </div>
  );
}
