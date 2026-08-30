import html2canvas from 'html2canvas';

async function captureNode(node) {
  return html2canvas(node, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
    logging: false,
  });
}

function downloadCanvas(canvas, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export async function downloadSlide(node, filename) {
  const canvas = await captureNode(node);
  downloadCanvas(canvas, filename);
}

export async function downloadAllSlides(nodes, basename) {
  const canvases = [];
  for (const node of nodes) {
    canvases.push(await captureNode(node));
  }

  const gap = 24;
  const widths = canvases.map((c) => c.width);
  const heights = canvases.map((c) => c.height);
  const totalW = widths.reduce((a, b) => a + b, 0) + gap * (canvases.length - 1);
  const maxH = Math.max(...heights);

  const sheet = document.createElement('canvas');
  sheet.width = totalW;
  sheet.height = maxH;
  const ctx = sheet.getContext('2d');
  ctx.fillStyle = '#0b0710';
  ctx.fillRect(0, 0, sheet.width, sheet.height);

  let x = 0;
  canvases.forEach((c) => {
    const y = Math.round((maxH - c.height) / 2);
    ctx.drawImage(c, x, y);
    x += c.width + gap;
  });

  downloadCanvas(sheet, `${basename}-slides.png`);
}
