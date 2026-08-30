const PEAK_TEMPLATES = [
  (t, g) => `${t}は、${g}の魅力が画面いっぱいに広がる。テンポと演出のキレが忘れられない。`,
  (t, g) => `世界観の密度が違う。${g}として王道を押さえつつ、${t}ならではの熱量が刺さる。`,
  (t) => `最初の数話で心を掴み、終盤で一気に加速する。${t}は“もう一回見たい”が止まらない。`,
];

const OSHI_TEMPLATES = [
  (t) => `推しは、信念を貫くキャラとその決断シーン。${t}の空気が一気に変わる瞬間が最高。`,
  (t) => `日常のさりげない表情と、決戦の眼光。ギャップが${t}の推しポイント。`,
  (t) => `象徴的な一カット——静寂のあと、音楽とカット割りが重なるシーンが心に残る。`,
];

const LINE_TEMPLATES = [
  (t, g) => `${g}の快感を、最短距離で叩き込む物語。`,
  (t) => `一言でいうと、胸の奥が熱くなるアニメ。`,
  (t) => `見終わったあとも、頭の中でOPが鳴り続ける。`,
  (t, g) => `${t}＝${g}を“今”感じたい人のための一作。`,
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pick(list, seed) {
  return list[seed % list.length];
}

function genreLabel(genres) {
  if (!genres?.length) return 'アニメ';
  return genres.slice(0, 2).join(' × ');
}

function fromSynopsis(synopsis) {
  if (!synopsis) return '';
  const cleaned = synopsis
    .replace(/\[Written by MAL Rewrite\]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  const sentence = cleaned.split(/(?<=[。！？.!?])/)[0] || cleaned;
  return sentence.length > 90 ? `${sentence.slice(0, 87)}…` : sentence;
}

export function generateAppeal({ title, synopsis, genres, score }) {
  const t = title?.trim() || 'この作品';
  const g = genreLabel(genres);
  const seed = hash(t);

  const syn = fromSynopsis(synopsis);
  const peak =
    syn || pick(PEAK_TEMPLATES, seed)(t, g);

  const oshi = pick(OSHI_TEMPLATES, seed >> 3)(t, g);
  const scored =
    typeof score === 'number'
      ? `MAL ${score.toFixed(1)}点。${pick(LINE_TEMPLATES, seed >> 5)(t, g)}`
      : pick(LINE_TEMPLATES, seed >> 5)(t, g);

  return {
    peak,
    oshi,
    oneLiner: scored,
  };
}
