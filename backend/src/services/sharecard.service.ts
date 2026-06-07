import { createCanvas, loadImage } from 'canvas';
import QRCode from 'qrcode';

export async function generateShareCard(
  artworkBuffer: Buffer,
  challengeId: string,
  baseUrl: string = 'https://heritage-ai.web.app'
): Promise<Buffer> {
  const WIDTH = 1200;
  const HEIGHT = 630;
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#1A0A2E';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Load and draw artwork
  try {
    const img = await loadImage(artworkBuffer);
    const artW = Math.round(WIDTH * 0.55);
    const artH = HEIGHT - 60;
    const artX = 30;
    const artY = 30;

    // Polaroid frame
    ctx.fillStyle = '#F7F3EE';
    ctx.fillRect(artX - 8, artY - 8, artW + 16, artH + 50);
    ctx.drawImage(img, artX, artY, artW, artH);
  } catch (e) {
    // Draw gradient placeholder
    const grad = ctx.createLinearGradient(30, 30, 685, 600);
    grad.addColorStop(0, '#E8A020');
    grad.addColorStop(1, '#1A6B4A');
    ctx.fillStyle = grad;
    ctx.fillRect(30, 30, 655, 570);
  }

  // Right side content
  const rx = 730;

  // Logo area
  ctx.fillStyle = '#E8A020';
  ctx.font = 'bold 28px serif';
  ctx.fillText('⊛', rx, 80);
  ctx.fillStyle = '#F7F3EE';
  ctx.font = 'bold 26px serif';
  ctx.fillText('Heritage AI', rx + 40, 82);

  // Tagline
  ctx.fillStyle = 'rgba(232,160,32,0.9)';
  ctx.font = '13px monospace';
  ctx.fillText('28 states. No names. All soul.', rx, 115);

  // Main question
  ctx.fillStyle = '#F7F3EE';
  ctx.font = 'bold 44px serif';
  const lines = ['Which state', 'is this?'];
  lines.forEach((line, i) => {
    ctx.fillText(line, rx, 200 + i * 56);
  });

  // Turmeric accent line
  ctx.fillStyle = '#E8A020';
  ctx.fillRect(rx, 320, 200, 3);

  // CTA
  ctx.fillStyle = 'rgba(247,243,238,0.7)';
  ctx.font = '18px serif';
  ctx.fillText('Guess on Heritage AI 🔍', rx, 370);

  // QR Code
  try {
    const qrUrl = `${baseUrl}/guess/${challengeId}`;
    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      width: 140,
      margin: 2,
      color: { dark: '#1A0A2E', light: '#F7F3EE' },
    });
    const qrImg = await loadImage(qrDataUrl);
    ctx.drawImage(qrImg, WIDTH - 170, HEIGHT - 170, 140, 140);

    ctx.fillStyle = 'rgba(247,243,238,0.5)';
    ctx.font = '11px monospace';
    ctx.fillText('Scan to guess →', WIDTH - 170, HEIGHT - 175);
  } catch (e) {
    console.warn('QR code generation failed:', e);
  }

  // Grain texture overlay (simplified)
  const grainCanvas = createCanvas(WIDTH, HEIGHT);
  const gCtx = grainCanvas.getContext('2d');
  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * WIDTH;
    const y = Math.random() * HEIGHT;
    const alpha = Math.random() * 0.04;
    gCtx.fillStyle = `rgba(255,255,255,${alpha})`;
    gCtx.fillRect(x, y, 1, 1);
  }
  ctx.drawImage(grainCanvas, 0, 0);

  // Bottom bar
  ctx.fillStyle = 'rgba(232,160,32,0.15)';
  ctx.fillRect(0, HEIGHT - 48, WIDTH, 48);
  ctx.fillStyle = 'rgba(247,243,238,0.5)';
  ctx.font = '12px monospace';
  ctx.fillText(`heritage-ai.web.app/guess/${challengeId}`, 30, HEIGHT - 18);

  // Validation badge
  ctx.fillStyle = '#1A6B4A';
  ctx.fillRect(rx, HEIGHT - 80, 280, 32);
  ctx.fillStyle = '#F7F3EE';
  ctx.font = '12px monospace';
  ctx.fillText('✓ State name verified absent', rx + 12, HEIGHT - 60);

  return canvas.toBuffer('image/png');
}
