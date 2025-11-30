// MediaPreloader.js - Handles file preloading and caching

export class MediaPreloader {
  constructor(options) {
    this.options = options;
    this.preloadedMedia = {};
    this.loadingProgress = {};
    this.onProgressCallbacks = [];
  }

  onProgress(callback) {
    this.onProgressCallbacks.push(callback);
  }

  notifyProgress(index, progress) {
    this.onProgressCallbacks.forEach((cb) => cb(index, progress));
  }

  preloadAll(files) {
    files.forEach((file, index) => {
      this.preloadFile(file, index);
    });
  }

  preloadFile(file, index) {
    // Skip if already loaded
    if (this.preloadedMedia[index] && this.loadingProgress[index] === 100) {
      return Promise.resolve(this.preloadedMedia[index]);
    }

    this.loadingProgress[index] = this.loadingProgress[index] || 0;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", file.url, true);

      // Set responseType based on file type
      xhr.responseType =
        file.type === "excel"
          ? "arraybuffer"
          : ["video", "pdf", "image"].includes(file.type)
          ? "blob"
          : "text";

      xhr.onprogress = (e) => {
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
        this.loadingProgress[index] = 100;
        this.notifyProgress(index, 100);
        reject(new Error("Network error"));
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
