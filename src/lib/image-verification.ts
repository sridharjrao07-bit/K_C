
export interface ImageCheckResult {
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

export const ImageVerificationService = {
  /**
   * 1. Visible Layer: Basic Quality Check
   * Checks file size and dimensions
   */
  async verifyImageQuality(file: File): Promise<ImageCheckResult> {
    // Check 1: File Size (Max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return {
        status: 'error',
        message: 'File is too large',
        details: 'Please upload a photo under 5MB.'
      };
    }

    // Check 2: File Size (Min 50KB - filter out tiny icons/thumbnails)
    if (file.size < 50 * 1024) {
      return {
        status: 'warning',
        message: 'Photo might be blurry',
        details: 'This image looks very small. Buyers prefer clear, high-quality photos.'
      };
    }

    // Check 3: Dimensions (Async)
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        if (width < 800 || height < 800) {
          resolve({
            status: 'warning',
            message: 'Low Resolution',
            details: 'This photo might look blurry on large screens. Try to use a photo at least 800 pixels wide.'
          });
        } else {
          resolve({
            status: 'success',
            message: 'Good Quality!',
            details: 'This photo looks sharp and clear.'
          });
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        resolve({
          status: 'error',
          message: 'Invalid Image',
          details: 'We clearly could not read this image file.'
        });
      };
    });
  },

  /**
   * 2. Invisible Layer: Metadata Check
   * Checks if the photo is "too old" (likely downloaded) vs recent (likely original)
   */
  checkRecentWork(file: File): ImageCheckResult {
    // Note: lastModified is not 100% reliable as downloading a file updates it,
    // but it's a good heuristic for "created content" flows.
    const lastModified = file.lastModified;
    const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000); // 1 year
    const twentyYearsAgo = Date.now() - (20 * 365 * 24 * 60 * 60 * 1000);

    if (lastModified < twentyYearsAgo) {
      // Very old timestamp often indicates stripped metadata or very old stock
      return {
        status: 'warning',
        message: 'Metadata Missing',
        details: 'We couldn\'t verify when this photo was taken.'
      };
    }

    // This is a "silent" check usually, but we return status for the UI to use if desired
    return {
      status: 'success',
      message: 'Verified Recent',
      details: 'Timestamp looks good.'
    };
  },

  /**
   * 3. Invisible Layer: Simulated Reverse Image Search
   * In a real app, this would call Google Vision API or TinEye.
   * Here we mock it with a random probability to demonstrate the generic flow.
   */
  async simulateReverseImageSearch(file: File): Promise<ImageCheckResult> {
    return new Promise((resolve) => {
      // DNA Logic: 95% chance of pass, 5% chance of "suspicious" for demo
      setTimeout(() => {
        const isSuspicious = Math.random() > 0.95;

        if (isSuspicious) {
          resolve({
            status: 'warning',
            message: 'Potential Duplicate',
            details: 'This image appears on other websites. Please ensure you took this photo yourself.'
          });
        } else {
          resolve({
            status: 'success',
            message: 'Original Content',
            details: 'No duplicates found online.'
          });
        }
      }, 1500); // Simulate API latency
    });
  },

  /**
   * 4. Invisible Layer: Content Safety
   * Checks for NSFW or inappropriate content (Mock)
   */
  async simulateContentSafety(file: File): Promise<ImageCheckResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Assume safe for demo
        resolve({
          status: 'success',
          message: 'Safe Content',
          details: 'Image meets safety guidelines.'
        });
      }, 800);
    });
  }
};
