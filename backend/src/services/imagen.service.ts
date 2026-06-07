// Imagen 3 via Vertex AI (requires GOOGLE_APPLICATION_CREDENTIALS or GEMINI_API_KEY with Vertex access)
export async function generateImage(prompt: string): Promise<Buffer> {
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    // Try Imagen 3 via Gemini API (imagen-3.0-generate-001)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: '1:1',
            safetyFilterLevel: 'block_some',
            personGeneration: 'allow_adult',
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Imagen API error: ${response.status}`);
    }

    const data = await response.json() as any;
    const b64 = data.predictions[0].bytesBase64Encoded;
    return Buffer.from(b64, 'base64');
  } catch (error) {
    console.warn('Imagen 3 unavailable, using placeholder:', error);
    // Return a placeholder gradient image buffer
    return generatePlaceholderImage(prompt);
  }
}

async function generatePlaceholderImage(prompt: string): Promise<Buffer> {
  // Generate a simple placeholder using Canvas when Imagen is unavailable
  try {
    const { createCanvas } = await import('canvas');
    const canvas = createCanvas(1024, 1024);
    const ctx = canvas.getContext('2d');

    // Rich gradient background
    const colors: [string, string][] = [
      ['#1A0A2E', '#E8A020'],
      ['#0D1B2A', '#1A6B4A'],
      ['#2D1B00', '#C1392B'],
      ['#0A1628', '#E8A020'],
    ];
    const palette = colors[Math.floor(Math.random() * colors.length)];

    const gradient = ctx.createRadialGradient(512, 512, 0, 512, 512, 720);
    gradient.addColorStop(0, palette[1] + '40');
    gradient.addColorStop(0.5, palette[0]);
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 1024);

    // Decorative pattern
    ctx.strokeStyle = palette[1] + '30';
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      const x = (i / 20) * 1024;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
    }

    // Center text
    ctx.fillStyle = palette[1];
    ctx.font = 'bold 32px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Heritage AI', 512, 480);
    ctx.fillStyle = 'rgba(247,243,238,0.6)';
    ctx.font = '20px serif';
    ctx.fillText('Cultural Mystery', 512, 530);

    return canvas.toBuffer('image/png');
  } catch {
    // Final fallback: 1x1 pixel PNG
    return Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
  }
}
