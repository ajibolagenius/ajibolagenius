/**
 * Client-side resize + re-encode before Supabase Storage upload (storage + bandwidth).
 * Skips non-raster, GIF (animation), SVG, and files that fail to decode.
 */

const WEBP = 'image/webp';
const JPEG = 'image/jpeg';

let webpOk;
function supportsWebp() {
  if (webpOk !== undefined) return webpOk;
  try {
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    webpOk = c.toDataURL(WEBP).startsWith('data:image/webp');
  } catch {
    webpOk = false;
  }
  return webpOk;
}

function baseName(name) {
  const n = String(name || 'image');
  const i = n.lastIndexOf('.');
  if (i <= 0) return n;
  return n.slice(0, i);
}

/**
 * @param {File} file
 * @param {{ maxDimension?: number; quality?: number }} [options]
 * @returns {Promise<{ file: File; contentType: string }>}
 */
export async function compressImageForUpload(file, options = {}) {
  const maxDimension = options.maxDimension ?? 1920;
  const quality = options.quality ?? 0.82;

  if (!file?.type?.startsWith('image/')) {
    return { file, contentType: file.type || 'application/octet-stream' };
  }
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return { file, contentType: file.type };
  }

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return { file, contentType: file.type };
  }

  try {
    const w0 = bitmap.width;
    const h0 = bitmap.height;
    const maxEdge = Math.max(w0, h0);
    const scale = maxEdge > maxDimension ? maxDimension / maxEdge : 1;
    const w = Math.max(1, Math.round(w0 * scale));
    const h = Math.max(1, Math.round(h0 * scale));

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { file, contentType: file.type };
    }
    ctx.drawImage(bitmap, 0, 0, w, h);

    const mime = supportsWebp() ? WEBP : JPEG;
    const ext = mime === WEBP ? 'webp' : 'jpg';

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('encode'))), mime, quality);
    }).catch(() => null);

    if (!blob || blob.size >= file.size) {
      return { file, contentType: file.type };
    }

    const outName = `${baseName(file.name)}.${ext}`;
    const outFile = new File([blob], outName, { type: mime });
    return { file: outFile, contentType: mime };
  } finally {
    bitmap.close();
  }
}

/** Presets aligned with typical portfolio / OG use. */
export const IMAGE_UPLOAD_PRESETS = {
  projectScreenshot: { maxDimension: 1920, quality: 0.82 },
  galleryImage: { maxDimension: 1920, quality: 0.8 },
  assetImage: { maxDimension: 1920, quality: 0.82 },
};
