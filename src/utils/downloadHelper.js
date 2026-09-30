/**
 * Utility to download full-resolution artwork files reliably.
 */
export async function downloadArtwork(url, title, originalFilename) {
  try {
    const filename = originalFilename || `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);
    return true;
  } catch (err) {
    console.warn('Direct blob download failed, falling back to window trigger:', err);
    const a = document.createElement('a');
    a.href = url;
    a.download = originalFilename || 'artwork.png';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  }
}
