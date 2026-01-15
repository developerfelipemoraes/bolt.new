export async function loadImageWithCORS(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn(`Failed to load image: ${url}`);
      resolve(null);
    };

    img.src = url;

    setTimeout(() => {
      if (!img.complete) {
        console.warn(`Image load timeout: ${url}`);
        resolve(null);
      }
    }, 10000);
  });
}

export async function resizeImage(
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number
): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  let width = img.width;
  let height = img.height;

  if (width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.85);
}

export async function loadAndResizeImage(
  url: string,
  maxWidth: number,
  maxHeight: number
): Promise<string | null> {
  // 1) Tenta carregar diretamente (com crossOrigin)
  try {
    const img = await loadImageWithCORS(url);
    if (img) {
      return await resizeImage(img, maxWidth, maxHeight);
    }
    console.warn('Direct image load failed, will try proxy fallback:', url);
  } catch (err) {
    console.warn('Direct image load error:', err);
  }

  // 2) Tenta via proxy público (images.weserv.nl) removendo o protocolo
  try {
    try {
      const parsed = new URL(url);
      const hostPath = parsed.host + parsed.pathname + (parsed.search || '');
      const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(hostPath)}`;
      console.info('Trying image proxy:', proxyUrl);
      const imgProxy = await loadImageWithCORS(proxyUrl);
      if (imgProxy) {
        return await resizeImage(imgProxy, maxWidth, maxHeight);
      }
      console.warn('Proxy image load failed:', proxyUrl);
    } catch (parseErr) {
      console.warn('Invalid image URL for proxy fallback:', url, parseErr);
    }
  } catch (err) {
    console.warn('Proxy image load error:', err);
  }

  // 3) Fallback final: placeholder
  try {
    console.info('Using placeholder image for', url);
    return getPlaceholderImage();
  } catch (err) {
    console.error('Error generating placeholder image:', err);
    return null;
  }
}

export function getPlaceholderImage(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 200;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#999';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Imagem não disponível', canvas.width / 2, canvas.height / 2);

  return canvas.toDataURL();
}

export function filterValidImages(urls: string[]): string[] {
  return urls.filter(url => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return !lower.endsWith('.psd');
  });
}
