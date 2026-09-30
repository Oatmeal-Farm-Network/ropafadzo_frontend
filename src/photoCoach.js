/** Instant shot check before a crop question. Runs in the browser, no upload. */
export function coachPhoto(dataUrl) {
  return new Promise((resolve) => {
    if (!dataUrl) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const size = 64;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);
      const gray = new Float32Array(size * size);
      let sum = 0;
      let green = 0;
      const pixels = size * size;
      for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
        const r = data[i] / 255;
        const g = data[i + 1] / 255;
        const b = data[i + 2] / 255;
        gray[p] = (r + g + b) / 3;
        sum += gray[p];
        const greenLeaf = g > r + 0.02 && g > b + 0.02;
        // Ripe wheat / dry pasture / tassels are gold, not green.
        const goldCanopy = r > 0.22 && g > 0.18 && b < 0.42 && (r + g) > 2.05 * b && Math.abs(r - g) < 0.28;
        if (greenLeaf || goldCanopy) green += 1;
      }
      const mean = sum / pixels;
      const veg = green / pixels;
      let sharp = 0;
      let edges = 0;
      for (let y = 1; y < size - 1; y += 1) {
        for (let x = 1; x < size - 1; x += 1) {
          const i = y * size + x;
          const gx = gray[i + 1] - gray[i - 1];
          const gy = gray[i + size] - gray[i - size];
          sharp += Math.hypot(gx, gy);
          edges += 1;
        }
      }
      sharp /= edges || 1;

      let ready = true;
      let tip = 'Clear enough to read. Ask your question.';
      if (mean < 0.16) {
        ready = false;
        tip = 'Too dark. Turn so the leaf is in daylight, not your shadow.';
      } else if (mean > 0.94) {
        ready = false;
        tip = 'Washed out. Keep the sun off the lens and off the leaf.';
      } else if (veg < 0.05) {
        ready = false;
        tip = 'Not enough plant in the frame. Fill the photo with the leaf, heads, or canopy.';
      } else if (sharp < 0.03) {
        ready = true;
        tip = 'A bit blurry — Crop Scan will still try. A sharper shot is more accurate.';
      }
      resolve({ ready, tip });
    };
    img.onerror = () => resolve({
      ready: false,
      tip: 'This file did not open. Take a new JPEG with the camera.',
    });
    img.src = dataUrl;
  });
}
