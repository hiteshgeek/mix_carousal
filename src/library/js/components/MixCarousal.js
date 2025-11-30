// MixCarousal.js - Main Library Class (FIXED - Autoload Options)

import { MediaPreloader } from "./MediaPreloader.js";
import { MediaRenderer } from "./MediaRenderer.js";
import { ModalController } from "./ModalController.js";

export default class MixCarousal {
  constructor(options = {}) {
    console.log(options);
    this.options = {
      container: options.container || document.body,
      files: options.files || [],
      // 🔹 FIXED: autoPreload can be true, false, or array of file types
      autoPreload:
        options.autoPreload !== undefined ? options.autoPreload : true,
      enableManualLoading:
        options.enableManualLoading !== undefined
          ? options.enableManualLoading
          : true,
      visibleTypes: options.visibleTypes || [
        "image",
        "video",
        "pdf",
        "excel",
        "csv",
        "text",
      ],
      previewableTypes: options.previewableTypes || [
        "image",
        "video",
        "pdf",
        "csv",
        "excel",
        "text",
      ],
      thumbnailSize: options.thumbnailSize || 200,
      onFileClick: options.onFileClick || null,
      onFileDownload: options.onFileDownload || null,
      showShortcuts:
        options.showShortcuts !== undefined ? options.showShortcuts : true,
      maxPreviewRows: options.maxPreviewRows || 100,
      maxTextPreviewChars: options.maxTextPreviewChars || 50000,
    };

    this.currentIndex = 0;
    this.preloader = new MediaPreloader(this.options);
    this.renderer = new MediaRenderer(this.options, this.preloader);
    this.modal = new ModalController(
      this.options,
      this.preloader,
      this.renderer
    );

    this.init();
  }

  init() {
    this.render();

    // 🔹 FIXED: Check autoPreload type and preload accordingly
    if (this.shouldAutoPreload()) {
      this.preloader.preloadAll(this.getAutoPreloadFiles());
    }

    this.attachEventListeners();
  }

  // 🔹 NEW: Check if autoPreload is enabled
  shouldAutoPreload() {
    return this.options.autoPreload !== false;
  }

  // 🔹 NEW: Get files that should be auto-preloaded based on autoPreload setting
  getAutoPreloadFiles() {
    if (this.options.autoPreload === true) {
      // Preload all visible and previewable files
      return this.getPreloadableFiles();
    } else if (Array.isArray(this.options.autoPreload)) {
      // Preload only specified file types
      return this.options.files.filter(
        (file) =>
          this.options.visibleTypes.includes(file.type) &&
          this.options.previewableTypes.includes(file.type) &&
          this.options.autoPreload.includes(file.type)
      );
    }
    return [];
  }

  // 🔹 Get files that CAN be preloaded (visible AND previewable)
  getPreloadableFiles() {
    return this.options.files.filter(
      (file) =>
        this.options.visibleTypes.includes(file.type) &&
        this.options.previewableTypes.includes(file.type)
    );
  }

  // All files are shown in the grid
  getVisibleFiles() {
    return this.options.files;
  }

  render() {
    const container = this.options.container;
    container.innerHTML = this.generateHTML();
    this.renderGrid();
  }

  generateHTML() {
    // 🔹 FIXED: Show toggle button if autoPreload is false or array (not true)
    const showToggleButton =
      this.options.autoPreload !== true && this.options.enableManualLoading;

    return `
      <div class="mg-container">
        ${this.options.showShortcuts ? this.generateShortcutsHTML() : ""}
        <div class="mg-header">
          <h1 class="mg-title">Media Gallery</h1>
          ${
            this.options.showShortcuts
              ? `
            <button class="mg-shortcuts-btn" data-mg-shortcuts-toggle>
              <svg class="mg-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
              </svg>
              Shortcuts
            </button>
          `
              : ""
          }
        </div>
        <div class="mg-grid" data-mg-grid></div>
      </div>
      <div class="mg-modal" data-mg-modal>
        <div class="mg-modal-container">
          <div class="mg-modal-header">
            <div class="mg-modal-title-section">
              <h2 class="mg-modal-file-name" data-mg-modal-filename>File Name</h2>
              <span class="mg-file-badge" data-mg-modal-filetype>TYPE</span>
            </div>
            <div class="mg-modal-actions">
              ${
                showToggleButton
                  ? `
              <button class="mg-modal-btn mg-preload-toggle-btn" data-mg-preload-toggle title="Toggle Preload">
                <svg class="mg-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
              </button>
              `
                  : ""
              }
              <button class="mg-modal-btn mg-download-btn" data-mg-download title="Download (D)">
                <svg class="mg-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </button>
              <button class="mg-modal-btn mg-close-btn" data-mg-close title="Close (Esc)">
                <svg class="mg-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="mg-modal-content-wrapper">
            <button class="mg-nav-button mg-prev" data-mg-prev>
              <svg class="mg-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <div class="mg-modal-content" data-mg-modal-content></div>
            <button class="mg-nav-button mg-next" data-mg-next>
              <svg class="mg-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
          <div class="mg-thumbnail-strip" data-mg-thumbnail-strip></div>
        </div>
      </div>
    `;
  }

  generateShortcutsHTML() {
    return `
      <div class="mg-shortcuts-panel" data-mg-shortcuts-panel>
        <h3 class="mg-shortcuts-title">Keyboard Shortcuts</h3>
        <div class="mg-shortcuts-grid">
          <div class="mg-shortcut-item">
            <span class="mg-shortcut-key">←</span>
            <span class="mg-shortcut-desc">Previous</span>
          </div>
          <div class="mg-shortcut-item">
            <span class="mg-shortcut-key">→</span>
            <span class="mg-shortcut-desc">Next</span>
          </div>
          <div class="mg-shortcut-item">
            <span class="mg-shortcut-key">Esc</span>
            <span class="mg-shortcut-desc">Close</span>
          </div>
          <div class="mg-shortcut-item">
            <span class="mg-shortcut-key">D</span>
            <span class="mg-shortcut-desc">Download</span>
          </div>
        </div>
      </div>
    `;
  }

  renderGrid() {
    const grid = this.options.container.querySelector("[data-mg-grid]");
    const visibleFiles = this.getVisibleFiles();

    grid.innerHTML = visibleFiles
      .map(
        (file, i) => `
      <div class="mg-thumbnail-card" data-mg-index="${i}">
        <div class="mg-thumb-wrapper">
          ${
            file.type === "video"
              ? `
            <div class="mg-video-icon-wrapper">
              <i class="fa fa-play mg-video-icon"></i>
            </div>
          `
              : ""
          }
          <img src="${file.thumbnail}" alt="${
          file.name
        }" class="mg-thumbnail-image mg-lazy-thumb" loading="lazy" />
        </div>
        <button class="mg-download-thumb-btn" data-mg-download-thumb="${i}">
          <svg class="mg-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
        </button>
        <div class="mg-thumbnail-info">
          <div class="mg-file-name">${file.name}</div>
          <div class="mg-file-type">${file.type}</div>
        </div>
      </div>
    `
      )
      .join("");

    // 🔹 FIXED: Grid thumbnails ALWAYS load (not affected by autoPreload)
    setTimeout(() => this.applyLazyPlaceholder(), 300);
  }

  applyLazyPlaceholder() {
    const thumbnails =
      this.options.container.querySelectorAll(".mg-lazy-thumb");

    thumbnails.forEach((img, index) => {
      const markLoaded = () => {
        const wrapper = img.closest(".mg-thumb-wrapper");
        if (wrapper) {
          wrapper.classList.add("mg-loaded");
        }

        // 🔹 FIXED: Don't mark as preloaded in preloader, just UI
        // Grid thumbnails are separate from main file preloading
      };

      img.addEventListener("load", markLoaded);
      if (img.complete) markLoaded();
    });
  }

  attachEventListeners() {
    const container = this.options.container;

    // Grid click handlers
    container.addEventListener("click", (e) => {
      const card = e.target.closest("[data-mg-index]");
      if (card) {
        const index = parseInt(card.dataset.mgIndex);
        this.openModal(index);
      }

      const downloadBtn = e.target.closest("[data-mg-download-thumb]");
      if (downloadBtn) {
        e.stopPropagation();
        const index = parseInt(downloadBtn.dataset.mgDownloadThumb);
        this.downloadFile(index);
      }

      if (e.target.closest("[data-mg-shortcuts-toggle]")) {
        this.toggleShortcuts();
      }
    });

    // Modal event delegation
    this.modal.attachEventListeners();

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (!this.modal.isOpen()) return;

      switch (e.key) {
        case "ArrowLeft":
          this.modal.prev();
          break;
        case "ArrowRight":
          this.modal.next();
          break;
        case "Escape":
          this.modal.close();
          break;
        case "d":
        case "D":
          this.downloadFile(this.modal.currentIndex);
          break;
      }
    });
  }

  toggleShortcuts() {
    const panel = this.options.container.querySelector(
      "[data-mg-shortcuts-panel]"
    );
    if (panel) {
      panel.classList.toggle("mg-active");
    }
  }

  openModal(index) {
    this.modal.open(index, this.options.files);
  }

  downloadFile(index) {
    const file = this.options.files[index];

    if (this.options.onFileDownload) {
      this.options.onFileDownload(file, index);
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
    this.preloader.cleanup();
    this.modal.destroy();
  }

  // Public API methods
  preloadFiles() {
    this.preloader.preloadAll(this.getPreloadableFiles());
  }

  updateFiles(files) {
    this.options.files = files;
    this.renderGrid();

    if (this.shouldAutoPreload()) {
      this.preloader.preloadAll(this.getAutoPreloadFiles());
    }
  }
}

export { MixCarousal };
