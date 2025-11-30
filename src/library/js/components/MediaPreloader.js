// MediaPreloader.js - Handles file preloading and caching (FIXED)

export class MediaPreloader {
  constructor(options) {
    this.options = options;
    this.preloadedMedia = {};
    this.loadingProgress = {};
    this.onProgressCallbacks = [];
    this.activeRequests = {}; // Track active XHR requests
    this.isPaused = false; // Track pause state
  }

  onProgress(callback) {
    this.onProgressCallbacks.push(callback);
  }

  notifyProgress(index, progress) {
    this.onProgressCallbacks.forEach((cb) => cb(index, progress));
  }

  preloadAll(files) {
    this.isPaused = false;
    files.forEach((file) => {
      const originalIndex = this.options.files.indexOf(file);
      if (originalIndex !== -1) {
        this.preloadFile(file, originalIndex);
      }
    });
  }

  // 🔹 FIXED: Stop all active preloading and reset progress
  stop() {
    this.isPaused = true;
    Object.keys(this.activeRequests).forEach((index) => {
      const xhr = this.activeRequests[index];
      if (xhr) {
        xhr.abort();
        delete this.activeRequests[index];
      }
    });
    // Reset progress for stopped files
    Object.keys(this.loadingProgress).forEach((index) => {
      if (this.loadingProgress[index] < 100) {
        this.loadingProgress[index] = 0;
        this.notifyProgress(index, 0);
      }
    });
  }

  // 🔹 Check if file should be preloaded based on autoPreload setting
  shouldPreloadFile(file) {
    const autoPreload = this.options.autoPreload;

    // If autoPreload is true, preload all visible and previewable files
    if (autoPreload === true) {
      return (
        this.options.visibleTypes.includes(file.type) &&
        this.options.previewableTypes.includes(file.type)
      );
    }

    // If autoPreload is array, only preload specified types
    if (Array.isArray(autoPreload)) {
      return (
        this.options.visibleTypes.includes(file.type) &&
        this.options.previewableTypes.includes(file.type) &&
        autoPreload.includes(file.type)
      );
    }

    // If autoPreload is false, don't preload
    return false;
  }

  // 🔹 Check if file was auto-preloaded
  isFileAutoPreloaded(file) {
    if (this.options.autoPreload === true) {
      return true;
    }
    if (Array.isArray(this.options.autoPreload)) {
      return this.options.autoPreload.includes(file.type);
    }
    return false;
  }

  preloadFile(file, index) {
    // Skip if already loaded
    if (this.preloadedMedia[index] && this.loadingProgress[index] === 100) {
      return Promise.resolve(this.preloadedMedia[index]);
    }

    // Skip if paused
    if (this.isPaused) {
      return Promise.resolve(null);
    }

    // Check if this file type should be preloaded
    const shouldPreload =
      this.options.visibleTypes.includes(file.type) &&
      this.options.previewableTypes.includes(file.type);

    if (!shouldPreload) {
      return Promise.resolve(null);
    }

    // Initialize progress if not set
    if (this.loadingProgress[index] === undefined) {
      this.loadingProgress[index] = 0;
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      this.activeRequests[index] = xhr;

      xhr.open("GET", file.url, true);

      // Set responseType based on file type
      xhr.responseType =
        file.type === "excel"
          ? "arraybuffer"
          : ["video", "pdf", "image"].includes(file.type)
          ? "blob"
          : "text";

      xhr.onprogress = (e) => {
        if (this.isPaused) {
          xhr.abort();
          return;
        }

        if (e.lengthComputable) {
          this.loadingProgress[index] = Math.min(
            (e.loaded / e.total) * 100,
            99
          );
        } else if (this.loadingProgress[index] < 90) {
          this.loadingProgress[index] += 5;
        }
        this.notifyProgress(index, this.loadingProgress[index]);
      };

      xhr.onload = () => {
        delete this.activeRequests[index];

        if (xhr.status === 200) {
          if (["image", "video", "pdf"].includes(file.type)) {
            this.preloadedMedia[index] = URL.createObjectURL(xhr.response);
          } else {
            this.preloadedMedia[index] = xhr.response;
          }
          this.loadingProgress[index] = 100;
          this.notifyProgress(index, 100);
          resolve(this.preloadedMedia[index]);
        } else {
          this.loadingProgress[index] = 100;
          this.notifyProgress(index, 100);
          reject(new Error(`Failed to load: ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        delete this.activeRequests[index];
        this.loadingProgress[index] = 100;
        this.notifyProgress(index, 100);
        reject(new Error("Network error"));
      };

      xhr.onabort = () => {
        delete this.activeRequests[index];
        // Don't resolve, just exit silently when aborted
        resolve(null);
      };

      xhr.send();
    });
  }

  getPreloadedMedia(index) {
    return this.preloadedMedia[index];
  }

  getProgress(index) {
    return this.loadingProgress[index] || 0;
  }

  isLoaded(index) {
    return this.loadingProgress[index] === 100;
  }

  isLoading(index) {
    const progress = this.loadingProgress[index] || 0;
    return progress > 0 && progress < 100;
  }

  cleanup() {
    // Stop any active preloading
    this.stop();

    // Revoke blob URLs to free memory
    Object.values(this.preloadedMedia).forEach((url) => {
      if (typeof url === "string" && url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
    this.preloadedMedia = {};
    this.loadingProgress = {};
  }
}

export default MediaPreloader;
