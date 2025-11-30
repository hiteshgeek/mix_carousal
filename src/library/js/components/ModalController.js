// ModalController.js - Handles modal operations (FIXED)

export class ModalController {
  constructor(options, preloader, renderer) {
    this.options = options;
    this.preloader = preloader;
    this.renderer = renderer;
    this.currentIndex = 0;
    this.files = [];

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

  isOpen() {
    const modal = this.options.container.querySelector("[data-mg-modal]");
    return modal?.classList.contains("mg-active");
  }

  open(index, files) {
    this.currentIndex = index;
    this.files = files;

    const modal = this.options.container.querySelector("[data-mg-modal]");
    modal.classList.add("mg-active");

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

    strip.innerHTML = this.files
      .map((file, i) => {
        const activeClass = i === this.currentIndex ? " mg-active" : "";
        const videoIcon =
          file.type === "video"
            ? '<div class="mg-video-icon-wrapper"><i class="fa fa-play mg-video-icon"></i></div>'
            : "";

        // 🔹 FIX: Check if file is already loaded before rendering progress indicator
        const progress = this.preloader.getProgress(i);
        const isLoaded = progress === 100;
        const loadedClass = isLoaded ? " mg-loaded" : "";

        return `
        <div class="mg-strip-thumbnail${activeClass}${loadedClass}" data-mg-strip-index="${i}">
          <div class="mg-thumb-wrapper">
            ${videoIcon}
            <img src="${
              file.thumbnail
            }" class="mg-thumbnail-image mg-lazy-thumb" />
          </div>
          ${!isLoaded ? this.renderProgressIndicator(i) : ""}
        </div>
      `;
      })
      .join("");

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

    const indicator = card.querySelector(".mg-preload-indicator");
    const progressText = card.querySelector(".mg-progress-text");
    const progressCircle = card.querySelector(".mg-circle-progress");

    // 🔹 FIX: Properly hide indicator and mark as loaded when complete
    if (progress >= 100) {
      card.classList.add("mg-loaded");
      if (indicator) {
        indicator.classList.remove("mg-active");
        // 🔹 CRITICAL: Remove the indicator entirely from DOM
        indicator.remove();
      }
      return;
    }

    // 🔹 While loading (0-99%)
    if (progress > 0 && progress < 100) {
      if (indicator && !indicator.classList.contains("mg-active")) {
        indicator.classList.add("mg-active");
      }
      const offset = this.CIRCUMFERENCE - (progress / 100) * this.CIRCUMFERENCE;
      if (progressCircle) progressCircle.style.strokeDashoffset = offset;
      if (progressText) progressText.textContent = `${Math.round(progress)}%`;
    }
  }

  updateActiveThumbnail() {
    const modal = this.options.container.querySelector("[data-mg-modal]");
    const strip = modal.querySelector("[data-mg-thumbnail-strip]");

    strip.querySelectorAll(".mg-strip-thumbnail").forEach((thumb, i) => {
      if (i === this.currentIndex) {
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
    // Cleanup event listeners if needed
  }
}

export default ModalController;
