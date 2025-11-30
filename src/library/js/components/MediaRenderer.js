// MediaRenderer.js - Handles rendering of different media types

export class MediaRenderer {
  constructor(options, preloader) {
    this.options = options;
    this.preloader = preloader;
  }

  canPreview(fileType) {
    return this.options.previewableTypes.includes(fileType);
  }

  render(file, index, container) {
    if (!this.canPreview(file.type)) {
      return this.renderNoPreview(file, container);
    }

    const progress = this.preloader.getProgress(index);

    // Show loading if still preloading
    if (progress > 0 && progress < 100) {
      return this.renderLoading(file.type, progress, container, index);
    }

    // Render based on type
    switch (file.type) {
      case "image":
        return this.renderImage(file, index, container);
      case "video":
        return this.renderVideo(file, index, container);
      case "pdf":
        return this.renderPDF(file, index, container);
      case "text":
        return this.renderText(file, index, container);
      case "csv":
        return this.renderCSV(file, index, container);
      case "excel":
        return this.renderExcel(file, index, container);
      default:
        return this.renderNoPreview(file, container);
    }
  }

  renderLoading(type, progress, container, index) {
    container.innerHTML = `
      <div class="mg-loading-container">
        <div class="mg-spinner"></div>
        <p class="mg-loading-text">Loading ${type.toUpperCase()}... ${Math.round(
      progress
    )}%</p>
        <div class="mg-progress-bar-container">
          <div class="mg-progress-bar" style="width: ${progress}%"></div>
        </div>
      </div>
    `;

    // Poll for completion
    const checkInterval = setInterval(() => {
      const currentProg = this.preloader.getProgress(index);
      if (currentProg === 100) {
        clearInterval(checkInterval);
        // Re-render actual content
        const file = this.options.files[index];
        this.render(file, index, container);
      } else {
        const progressText = container.querySelector(".mg-loading-text");
        const progressBar = container.querySelector(".mg-progress-bar");
        if (progressText) {
          progressText.textContent = `Loading ${type.toUpperCase()}... ${Math.round(
            currentProg
          )}%`;
        }
        if (progressBar) {
          progressBar.style.width = `${currentProg}%`;
        }
      }
    }, 100);
  }

  renderImage(file, index, container) {
    const src = this.preloader.getPreloadedMedia(index) || file.url;
    container.innerHTML = `<img src="${src}" alt="${file.name}" class="mg-modal-image">`;
  }

  renderVideo(file, index, container) {
    const src = this.preloader.getPreloadedMedia(index) || file.url;
    const video = document.createElement("video");
    video.controls = true;
    video.className = "mg-modal-video";
    video.src = src;
    container.innerHTML = "";
    container.appendChild(video);
  }

  renderPDF(file, index, container) {
    const src = this.preloader.getPreloadedMedia(index) || file.url;
    container.innerHTML = `<object class="mg-pdf-embed" data="${src}#toolbar=1" type="application/pdf"></object>`;
  }

  renderText(file, index, container) {
    const content = this.preloader.getPreloadedMedia(index);
    if (!content) {
      return this.renderNoPreview(file, container);
    }

    const maxChars = this.options.maxTextPreviewChars;
    const preview =
      content.length > maxChars
        ? `${content.substring(
            0,
            maxChars
          )}\n\n... (File truncated for preview. Download to see full content.)`
        : content;

    container.innerHTML = `<div class="mg-text-preview">${this.escapeHtml(
      preview
    )}</div>`;
  }

  renderCSV(file, index, container) {
    const content = this.preloader.getPreloadedMedia(index);
    if (!content) {
      return this.renderNoPreview(file, container);
    }

    const tableHtml = this.parseCSV(content);
    container.innerHTML = tableHtml;
  }

  renderExcel(file, index, container) {
    const arrayBuffer = this.preloader.getPreloadedMedia(index);
    if (!arrayBuffer) {
      return this.renderNoPreview(file, container);
    }

    const tableHtml = this.parseExcel(arrayBuffer);
    container.innerHTML = tableHtml;
  }

  renderNoPreview(file, container) {
    container.innerHTML = `
      <div class="mg-placeholder-content">
        <svg class="mg-placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
        <h3 class="mg-placeholder-title">Preview Not Available</h3>
        <p class="mg-placeholder-desc">
          This file type cannot be previewed. Click the download button to view it locally.
        </p>
      </div>
    `;
  }

  parseCSV(csvText) {
    const lines = csvText.split("\n");
    const rows = [];

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === "") continue;

      const row = [];
      let current = "";
      let inQuotes = false;

      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          row.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      row.push(current.trim());
      rows.push(row);
    }

    if (rows.length === 0) {
      return '<div class="mg-placeholder-content"><p>No data found in CSV file.</p></div>';
    }

    const maxRows = Math.min(rows.length, this.options.maxPreviewRows);
    const headers = rows[0];
    const truncated = rows.length > this.options.maxPreviewRows;

    let html = '<div class="mg-csv-preview">';

    if (truncated) {
      html += `
        <div class="mg-csv-info">
          Showing first ${this.options.maxPreviewRows} rows of ${rows.length} total rows.
          Download file to see all data.
        </div>
      `;
    }

    html += '<table class="mg-csv-table"><thead><tr>';

    for (let h = 0; h < headers.length; h++) {
      html += `<th>${this.escapeHtml(headers[h].replace(/^"|"$/g, ""))}</th>`;
    }

    html += "</tr></thead><tbody>";

    for (let r = 1; r < maxRows; r++) {
      html += "<tr>";
      for (let c = 0; c < rows[r].length; c++) {
        html += `<td>${this.escapeHtml(rows[r][c].replace(/^"|"$/g, ""))}</td>`;
      }
      html += "</tr>";
    }

    html += "</tbody></table></div>";
    return html;
  }

  parseExcel(arrayBuffer) {
    try {
      if (typeof XLSX === "undefined") {
        return '<div class="mg-placeholder-content"><p>XLSX library not loaded. Include it to preview Excel files.</p></div>';
      }

      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (data.length === 0) {
        return '<div class="mg-placeholder-content"><p>No data found in Excel file.</p></div>';
      }

      const maxRows = Math.min(data.length, this.options.maxPreviewRows);
      const truncated = data.length > this.options.maxPreviewRows;

      let html = '<div class="mg-excel-preview">';

      if (workbook.SheetNames.length > 1) {
        html += `
          <div class="mg-excel-info">
            Showing sheet: "${this.escapeHtml(firstSheetName)}"
            (Total sheets: ${workbook.SheetNames.length})
          </div>
        `;
      }

      if (truncated) {
        html += `
          <div class="mg-excel-info">
            Showing first ${this.options.maxPreviewRows} rows of ${data.length} total rows.
            Download file to see all data.
          </div>
        `;
      }

      html += '<table class="mg-excel-table"><thead><tr>';

      const headers = data[0];
      for (let h = 0; h < headers.length; h++) {
        const headerValue =
          headers[h] !== undefined && headers[h] !== null
            ? String(headers[h])
            : "";
        html += `<th>${this.escapeHtml(headerValue)}</th>`;
      }

      html += "</tr></thead><tbody>";

      for (let r = 1; r < maxRows; r++) {
        html += "<tr>";
        for (let c = 0; c < data[r].length; c++) {
          const cellValue =
            data[r][c] !== undefined && data[r][c] !== null
              ? String(data[r][c])
              : "";
          html += `<td>${this.escapeHtml(cellValue)}</td>`;
        }
        html += "</tr>";
      }

      html += "</tbody></table></div>";
      return html;
    } catch (e) {
      return `
        <div class="mg-placeholder-content">
          <h3 class="mg-placeholder-title">Error Reading Excel File</h3>
          <p class="mg-placeholder-desc">Unable to parse the Excel file. Please download it to view.</p>
        </div>
      `;
    }
  }

  escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}

export default MediaRenderer;
