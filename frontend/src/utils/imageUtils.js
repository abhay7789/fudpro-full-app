/**
 * Converts binary/buffer image data from backend to a base64 data URI
 * @param {Object|String} imageField - The image field from the database
 * @param {String} fallback - Fallback URL if image is missing or invalid
 * @returns {String} Data URI or fallback URL
 */
export const getSafeImage = (imageField, fallback = 'https://placehold.co/600x400?text=No+Image') => {
  if (!imageField) return fallback;
  
  // If it's already a URL or base64 string
  if (typeof imageField === 'string' && (imageField.startsWith('http') || imageField.startsWith('data:'))) {
    return imageField;
  }

  // Handle Sequelize/Postgres Buffer/BLOB object
  if (imageField && imageField.data) {
    try {
      const uint8Array = new Uint8Array(imageField.data);
      
      // For large images, apply() might throw RangeError. Use a chunked approach or TextDecoder.
      // Modern browsers support TextDecoder but not for raw binary to base64 easily.
      // String.fromCharCode.apply is fine for small/medium images.
      
      let binary = '';
      const len = uint8Array.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      
      return `data:image/jpeg;base64,${window.btoa(binary)}`;
    } catch (e) {
      console.error('Failed to convert image buffer to base64', e);
      return fallback;
    }
  }

  return fallback;
};
