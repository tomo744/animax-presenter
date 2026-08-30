import { forwardRef } from 'react';
import SlideCard, { SLIDES } from './SlideCard';

const SlidePreview = forwardRef(function SlidePreview({ deck }, ref) {
  return (
    <section className="preview-wrap">
      <div className="preview-head">
        <h2>ライブプレビュー</h2>
        <p>入力と同時に3枚のショートスライドが更新されます</p>
      </div>
      <div className="preview-grid" ref={ref}>
        {SLIDES.map((slide, index) => (
          <SlideCard
            key={slide.key}
            slide={slide}
            deck={deck}
            index={index}
          />
        ))}
      </div>
    </section>
  );
});

export default SlidePreview;
