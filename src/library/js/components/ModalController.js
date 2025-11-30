// ModalController.js - Handles modal operations (FIXED)

export class ModalController {
  constructor(options, preloader, renderer) {
    this.options = options;
    this.preloader = preloader;
    this.renderer = renderer;
    this.currentIndex = 0;
    this.files = [];
    this.isPreloading = false;

    this.RADIUS = 15;
    this.CIRCUMFERENCE = 2 * Math.PI * this.RADIUS;
  }

  attachEventListeners() {
    const container = this.options.container;
    const modal = container.querySelector("[data-mg-modal]");

    // Close button
    const closeBtn = modal.querySelector("[data-mg-close]");
    closeBtn?.addEventListener("click", () => this.close());

    // Download button
    const downloadBtn = modal.querySelector("[data-mg-download]");
    downloadBtn?.addEventListener("click", () => this.downloadCurrent());

    // 🔹 Preload toggle button
    const preloadToggleBtn = modal.querySelector("[data-mg-preload-toggle]");
    preloadToggleBtn?.addEventListener("click", () => this.togglePreload());

    // Navigation buttons
    const prevBtn = modal.querySelector("[data-mg-prev]");
    const nextBtn = modal.querySelector("[data-mg-next]");

    prevBtn?.addEventListener("click", () => this.prev());
    nextBtn?.addEventListener("click", () => this.next());

    // Click outside to close
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.close();
      }
    });

    // Thumbnail strip clicks
    const thumbnailStrip = modal.querySelector("[data-mg-thumbnail-strip]");
    thumbnailStrip?.addEventListener("click", (e) => {
      const thumb = e.target.closest("[data-mg-strip-index]");
      if (thumb) {
        const index = parseInt(thumb.dataset.mgStripIndex);
        this.open(index, this.files);
      }
    });

    // Progress updates
    this.preloader.onProgress((index, progress) => {
      this.updateThumbnailProgress(index, progress);
    });
  }

  // 🔹 FIXED: Toggle preloading all files
  togglePreload() {
    if (this.isPreloading) {
      this.pausePreload();
    } else {
      this.startPreload();
    }
  }

  // 🔹 FIXED: Start preloading all files
  startPreload() {
    this.isPreloading = true;
    this.updatePreloadButton();

    // 🔹 CRITICAL: Immediately show loading state for current file
    const currentFile = this.files[this.currentIndex];
    const contentEl = this.options.container.querySelector(
      "[data-mg-modal-content]"
    );
    const currentProgress = this.preloader.getProgress(this.currentIndex);

    // If current file is previewable and not fully loaded, show loading immediately
    if (this.renderer.canPreview(currentFile.type) && currentProgress < 100) {
      // Force loading state to show immediately
      this.renderer.renderLoading(
        currentFile.type,
        currentProgress,
        contentEl,
        this.currentIndex
      );
    }

    const preloadableFiles = this.files.filter(
      (file) =>
        this.options.visibleTypes.includes(file.type) &&
        this.options.previewableTypes.includes(file.type)
    );

    this.preloader.preloadAll(preloadableFiles);
  }

  // 🔹 NEW: Pause preloading (not stop - keeps progress)
  pausePreload() {
    this.isPreloading = false;
    this.preloader.pause(); // Pause, not stop
    this.updatePreloadButton();

    // 🔹 CRITICAL: Immediately clear loading interval in renderer
    this.renderer.clearLoadingInterval();

    // 🔹 Show "Preview Not Loaded" for current file if not fully loaded
    const currentFile = this.files[this.currentIndex];
    const contentEl = this.options.container.querySelector(
      "[data-mg-modal-content]"
    );
    const currentProgress = this.preloader.getProgress(this.currentIndex);

    // Force re-render to show proper state (Preview Not Loaded or loaded content)
    if (this.renderer.canPreview(currentFile.type)) {
      // Clear the loading interval first
      this.renderer.clearLoadingInterval();
      // Then re-render
      this.renderer.render(currentFile, this.currentIndex, contentEl);
    }
  }

  // 🔹 Update preload button state
  updatePreloadButton() {
    const modal = this.options.container.querySelector("[data-mg-modal]");
    const btn = modal.querySelector("[data-mg-preload-toggle]");

    if (!btn) return;

    if (this.isPreloading) {
      btn.classList.add("mg-preloading");
      btn.title = "Click to Pause Loading";
      btn.innerHTML = `
        <svg class="mg-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="mg-btn-text">Pause Loading</span>
      `;
    } else {
      btn.classList.remove("mg-preloading");

      // Check if we have any partial progress (paused state vs initial state)
      const hasPartialProgress = this.files.some((file, index) => {
        const progress = this.preloader.getProgress(index);
        return progress > 0 && progress < 100;
      });

      if (hasPartialProgress) {
        btn.title = "Click to Resume Loading";
        btn.innerHTML = `
          <svg class="mg-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="mg-btn-text">Resume Loading</span>
        `;
      } else {
        btn.title = "Click to Load All Files";
        btn.innerHTML = `
          <svg class="mg-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <span class="mg-btn-text">Load All</span>
        `;
      }
    }
  }

  isOpen() {
    const modal = this.options.container.querySelector("[data-mg-modal]");
    return modal?.classList.contains("mg-active");
  }

  open(index, files) {
    this.currentIndex = index;
    this.files = files;

    const modal = this.options.container.querySelector("[data-mg-modal]");
    modal.classList.add("mg-active");

    // 🔹 Ensure button shows correct initial state
    this.updatePreloadButton();

    this.renderContent();
    this.renderThumbnailStrip();
    this.updateNavButtons();
  }

  close() {
    const modal = this.options.container.querySelector("[data-mg-modal]");
    const video = modal.querySelector("video");
    if (video) video.pause();

    modal.classList.remove("mg-active");
  }

  prev() {
    if (this.currentIndex > 0) {
      this.open(this.currentIndex - 1, this.files);
    }
  }

  next() {
    if (this.currentIndex < this.files.length - 1) {
      this.open(this.currentIndex + 1, this.files);
    }
  }

  renderContent() {
    const file = this.files[this.currentIndex];
    const modal = this.options.container.querySelector("[data-mg-modal]");

    const fileNameEl = modal.querySelector("[data-mg-modal-filename]");
    const fileTypeEl = modal.querySelector("[data-mg-modal-filetype]");
    const contentEl = modal.querySelector("[data-mg-modal-content]");

    fileNameEl.textContent = file.name;
    fileTypeEl.textContent = file.type.toUpperCase();

    this.renderer.render(file, this.currentIndex, contentEl);
  }

  renderThumbnailStrip() {
    const modal = this.options.container.querySelector("[data-mg-modal]");
    const strip = modal.querySelector("[data-mg-thumbnail-strip]");

    if (strip.childElementCount > 0) {
      this.updateActiveThumbnail();
      return;
    }

    const visibleFiles = this.files.filter((file) =>
      this.options.visibleTypes.includes(file.type)
    );

    strip.innerHTML = visibleFiles
      .map((file, i) => {
        const originalIndex = this.files.indexOf(file);
        const activeClass =
          originalIndex === this.currentIndex ? " mg-active" : "";
        const videoIcon =
          file.type === "video"
            ? '<div class="mg-video-icon-wrapper"><i class="fa fa-play mg-video-icon"></i></div>'
            : "";

        // 🔹 FIX: Only show progress if file is ACTIVELY being loaded (progress > 0 and < 100)
        const progress = this.preloader.getProgress(originalIndex);
        const isActivelyLoading = progress > 0 && progress < 100;
        const isLoaded = progress === 100;

        // Always show as loaded (no shimmer) unless actively loading
        const loadedClass = !isActivelyLoading ? " mg-loaded" : "";

        return `
        <div class="mg-strip-thumbnail${activeClass}${loadedClass}" data-mg-strip-index="${originalIndex}">
          <div class="mg-thumb-wrapper">
            ${videoIcon}
            <img src="${file.thumbnail}" class="mg-thumbnail-image" />
          </div>
          ${
            isActivelyLoading ? this.renderProgressIndicator(originalIndex) : ""
          }
        </div>
      `;
      })
      .join("");

    // 🔹 FIX: Mark all thumbnails as loaded immediately (they use thumbnail URLs, not full URLs)
    setTimeout(() => {
      strip.querySelectorAll(".mg-strip-thumbnail").forEach((thumb) => {
        const progress = this.preloader.getProgress(
          parseInt(thumb.dataset.mgStripIndex)
        );
        if (progress === 0 || progress === 100) {
          thumb.classList.add("mg-loaded");
        }
      });
    }, 0);

    this.updateActiveThumbnail();
  }

  renderProgressIndicator(index) {
    const progress = this.preloader.getProgress(index) || 0;
    const viewBoxSize = this.RADIUS * 2 + 5;
    const center = viewBoxSize / 2;
    const offset = this.CIRCUMFERENCE - (progress / 100) * this.CIRCUMFERENCE;
    const activeClass = progress > 0 && progress < 100 ? " mg-active" : "";

    return `
      <div class="mg-preload-indicator${activeClass}">
        <div class="mg-progress-circle">
          <svg viewBox="0 0 ${viewBoxSize} ${viewBoxSize}">
            <circle class="mg-circle-bg" cx="${center}" cy="${center}" r="${
      this.RADIUS
    }"></circle>
            <circle class="mg-circle-progress"
                    cx="${center}" cy="${center}" r="${this.RADIUS}"
                    stroke-dasharray="${this.CIRCUMFERENCE}"
                    stroke-dashoffset="${offset}">
            </circle>
          </svg>
          <span class="mg-progress-text">${Math.round(progress)}%</span>
        </div>
      </div>
    `;
  }

  updateThumbnailProgress(index, progress) {
    const modal = this.options.container.querySelector("[data-mg-modal]");
    const card = modal.querySelector(`[data-mg-strip-index="${index}"]`);

    if (!card) return;

    // 🔹 FIX: If progress is 0 or 100, ensure thumbnail is shown (no loading state)
    if (progress === 0 || progress === 100) {
      card.classList.add("mg-loaded");
      const indicator = card.querySelector(".mg-preload-indicator");
      if (indicator) {
        indicator.remove();
      }
      return;
    }

    // 🔹 Only show loading indicator if actively loading (0 < progress < 100)
    if (progress > 0 && progress < 100) {
      card.classList.remove("mg-loaded");

      let indicator = card.querySelector(".mg-preload-indicator");

      // Create indicator if it doesn't exist
      if (!indicator) {
        const wrapper = card.querySelector(".mg-thumb-wrapper");
        wrapper.insertAdjacentHTML(
          "beforeend",
          this.renderProgressIndicator(index)
        );
        indicator = card.querySelector(".mg-preload-indicator");
      }

      if (indicator && !indicator.classList.contains("mg-active")) {
        indicator.classList.add("mg-active");
      }

      const progressText = indicator?.querySelector(".mg-progress-text");
      const progressCircle = indicator?.querySelector(".mg-circle-progress");
      const offset = this.CIRCUMFERENCE - (progress / 100) * this.CIRCUMFERENCE;

      if (progressCircle) progressCircle.style.strokeDashoffset = offset;
      if (progressText) progressText.textContent = `${Math.round(progress)}%`;
    }
  }

  updateActiveThumbnail() {
    const modal = this.options.container.querySelector("[data-mg-modal]");
    const strip = modal.querySelector("[data-mg-thumbnail-strip]");

    strip.querySelectorAll(".mg-strip-thumbnail").forEach((thumb) => {
      const thumbIndex = parseInt(thumb.dataset.mgStripIndex);
      if (thumbIndex === this.currentIndex) {
        thumb.classList.add("mg-active");
        thumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      } else {
        thumb.classList.remove("mg-active");
      }
    });
  }

  updateNavButtons() {
    const modal = this.options.container.querySelector("[data-mg-modal]");
    const prevBtn = modal.querySelector("[data-mg-prev]");
    const nextBtn = modal.querySelector("[data-mg-next]");

    prevBtn.disabled = this.currentIndex === 0;
    nextBtn.disabled = this.currentIndex === this.files.length - 1;
  }

  downloadCurrent() {
    const file = this.files[this.currentIndex];

    if (this.options.onFileDownload) {
      this.options.onFileDownload(file, this.currentIndex);
    } else {
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  destroy() {
    if (this.isPreloading) {
      this.pausePreload();
    }
    // 🔹 NEW: Cleanup renderer
    this.renderer.cleanup();
  }
}

export default ModalController;
