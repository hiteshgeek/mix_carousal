// app.js;

var MEDIA_FILES = [
  {
    id: 1,
    type: "image",
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
    name: "Mountain_Landscape.jpg",
  },
  {
    id: 2,
    type: "image",
    thumbnail:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=150&h=150&fit=crop",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop",
    name: "Nature_View.jpg",
  },
  {
    id: 3,
    type: "video",
    thumbnail:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=150&h=150&fit=crop",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    name: "BigBuckBunny.mp4",
  },
  {
    id: 4,
    type: "video",
    thumbnail:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=150&h=150&fit=crop",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    name: "ElephantsDream.mp4",
  },
  {
    id: 5,
    type: "pdf",
    thumbnail: "https://cdn-icons-png.flaticon.com/512/337/337946.png",
    url: "https://pdfobject.com/pdf/sample.pdf",
    name: "Sample_Document.pdf",
  },
  {
    id: 6,
    type: "pdf",
    thumbnail: "https://cdn-icons-png.flaticon.com/512/337/337946.png",
    url: "https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf",
    name: "Antenna_Sample.pdf",
  },
  {
    id: 7,
    type: "excel",
    thumbnail: "https://cdn-icons-png.flaticon.com/512/732/732220.png",
    url: "media/excel_2.xlsx",
    name: "Sample_Data.xlsx",
  },
  {
    id: 8,
    type: "csv",
    thumbnail: "https://cdn-icons-png.flaticon.com/512/6133/6133884.png",
    url: "media/email.csv",
    name: "Pokemon_Data.csv",
  },
  {
    id: 9,
    type: "text",
    thumbnail: "https://cdn-icons-png.flaticon.com/512/337/337932.png",
    url: "https://raw.githubusercontent.com/minimaxir/big-list-of-naughty-strings/master/blns.txt",
    name: "Sample_Text.txt",
  },
  {
    id: 10,
    type: "image",
    thumbnail:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=150&h=150&fit=crop",
    url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=800&fit=crop",
    name: "Ocean_Sunset.jpg",
  },
  {
    id: 11,
    type: "image",
    thumbnail:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=150&h=150&fit=crop",
    url: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=1200&h=800&fit=crop",
    name: "Book_and_Coffee.jpg",
  },
  {
    id: 12,
    type: "video",
    thumbnail:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&h=150&fit=crop",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    name: "ForBiggerBlazes.mp4",
  },
  {
    id: 13,
    type: "csv",
    thumbnail: "https://cdn-icons-png.flaticon.com/512/6133/6133884.png",
    url: "media/username.csv",
    name: "GDP_Life_Expectancy.csv",
  },
  {
    id: 14,
    type: "text",
    thumbnail: "https://cdn-icons-png.flaticon.com/512/337/337932.png",
    url: "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt",
    name: "English_Words_List.txt",
  },
  {
    id: 15,
    type: "image",
    thumbnail:
      "https://images.pexels.com/photos/17528771/pexels-photo-17528771.jpeg",
    url: "https://images.pexels.com/photos/17528771/pexels-photo-17528771.jpeg",
    name: "Forest_Path.jpg",
  },
  {
    id: 16,
    type: "excel",
    thumbnail: "https://cdn-icons-png.flaticon.com/512/732/732220.png",
    url: "media/excel_2.xlsx",
    name: "Project_Timeline.xlsx",
  },
  {
    id: 17,
    type: "video",
    thumbnail:
      "https://images.pexels.com/photos/34875154/pexels-photo-34875154.jpeg",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    name: "TearsOfSteel.mp4",
  },
  {
    id: 18,
    type: "csv",
    thumbnail: "https://cdn-icons-png.flaticon.com/512/6133/6133884.png",
    url: "media/email.csv",
    name: "Country_List.csv",
  },
];

var currentIndex = 0;
var preloadedMedia = {};
var loadingProgress = {};

// Adjusted RADIUS for the smaller 5rem (80px) thumbnail size
const RADIUS = 15;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Generates the HTML for the circular progress indicator.
 */
function renderProgressIndicatorHtml(index, progress) {
  const viewBoxSize = RADIUS * 2 + 5; // e.g., 35 for 15 radius
  const center = viewBoxSize / 2;
  const offset = CIRCUMFERENCE - ((progress || 0) / 100) * CIRCUMFERENCE;
  const activeClass =
    (progress || 0) > 0 && (progress || 0) < 100 ? " active" : "";
  const displayProgress = Math.round(progress || 0);

  return `
    <div class="preload-indicator${activeClass}">
      <div class="progress-circle">
        <svg viewBox="0 0 ${viewBoxSize} ${viewBoxSize}">
          <circle class="circle-bg" cx="${center}" cy="${center}" r="${RADIUS}"></circle>
          <circle class="circle-progress"
                  cx="${center}" cy="${center}" r="${RADIUS}"
                  stroke-dasharray="${CIRCUMFERENCE}"
                  stroke-dashoffset="${offset}">
          </circle>
        </svg>
        <span class="progress-text">${displayProgress}%</span>
      </div>
    </div>`;
}

/**
 * Updates the visual progress indicator on the MODAL thumbnail strip.
 */
function updateThumbnailProgress(index) {
  var progress = loadingProgress[index];
  var card = document.querySelector(
    `#thumbnailStrip .strip-thumbnail[data-index="${index}"]`
  );

  if (!card) return;

  var indicator = card.querySelector(".preload-indicator");
  var progressText = card.querySelector(".progress-text");
  var progressCircle = card.querySelector(".circle-progress");

  // 🔹 When fully loaded — mark completed
  if (progress >= 100) {
    card.classList.add("loaded"); // 👈 Add 'loaded' class
    if (indicator) indicator.classList.remove("active");
    return;
  }

  // 🔹 While loading (0-99%)
  if (progress > 0 && progress < 100) {
    if (indicator && !indicator.classList.contains("active")) {
      indicator.classList.add("active");
    }
    var offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;
    if (progressCircle) progressCircle.style.strokeDashoffset = offset;
    if (progressText) progressText.textContent = `${Math.round(progress)}%`;
  }
}

function preloadMedia() {
  MEDIA_FILES.forEach(function (file, index) {
    // Skip preload if image was loaded already in grid
    if (preloadedMedia[index] && loadingProgress[index] === 100) {
      return;
    }

    loadingProgress[index] = loadingProgress[index] || 0;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", file.url, true);

    // Set responseType
    xhr.responseType =
      file.type === "excel"
        ? "arraybuffer"
        : file.type === "video" || file.type === "pdf" || file.type === "image"
        ? "blob"
        : "text";

    xhr.onprogress = function (e) {
      if (e.lengthComputable) {
        loadingProgress[index] = Math.min((e.loaded / e.total) * 100, 99);
      } else if (loadingProgress[index] < 90) {
        loadingProgress[index] += 5;
      }
      updateThumbnailProgress(index);
    };

    xhr.onload = function () {
      if (xhr.status === 200) {
        if (["image", "video", "pdf"].includes(file.type)) {
          preloadedMedia[index] = URL.createObjectURL(xhr.response); // 🚀 Cached Blob URL
        } else {
          preloadedMedia[index] = xhr.response; // text, csv, excel (raw or text)
        }
        loadingProgress[index] = 100;
      } else {
        loadingProgress[index] = 100;
      }
      updateThumbnailProgress(index);
    };

    xhr.onerror = function () {
      loadingProgress[index] = 100;
      updateThumbnailProgress(index);
    };

    xhr.send();
  });
}

function initGrid() {
  var grid = document.getElementById("mediaGrid");
  var html = MEDIA_FILES.map(
    (file, i) => `
    <div class="thumbnail-card" onclick="openModal(${i})">
      <div class="thumb-wrapper">
        <img src="${file.thumbnail}" alt="${file.name}" class="thumbnail-image lazy-thumb" loading="lazy" />
      </div>
      <button
        class="download-thumb-btn"
        onclick="event.stopPropagation(); downloadFile(${i})"
      >
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          ></path>
        </svg>
      </button>
      <div class="thumbnail-info">
        <div class="file-name">${file.name}</div>
        <div class="file-type">${file.type}</div>
      </div>
    </div>
  `
  ).join("");
  grid.innerHTML = html;
}

function toggleShortcuts() {
  document.getElementById("shortcutsPanel").classList.toggle("active");
}

function openModal(index) {
  currentIndex = index;
  document.getElementById("modal").classList.add("active");
  renderModalContent();
  updateActiveThumbnailOnly();
  updateNavButtons();
}

function closeModal() {
  var video = document.querySelector("#modalContent video");
  if (video) {
    video.pause();
  }
  document.getElementById("modal").classList.remove("active");
}

function handleModalClick(event) {
  if (event.target.id === "modal") {
    closeModal();
  }
}

function renderModalContent() {
  var file = MEDIA_FILES[currentIndex];
  var content = document.getElementById("modalContent");
  document.getElementById("modalFileName").textContent = file.name;
  document.getElementById("modalFileType").textContent = file.type;

  // Check for loading status first for preloaded files
  var progress = loadingProgress[currentIndex];
  if (progress > 0 && progress < 100) {
    content.innerHTML = `
      <div class="loading-container">
        <div class="spinner"></div>
        <p class="loading-text">
          Preloading ${file.type.toUpperCase()}... ${Math.round(progress)}%
        </p>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${progress}%"></div>
        </div>
      </div>
    `;

    var checkInterval = setInterval(function () {
      var currentProg = loadingProgress[currentIndex] || 0;
      if (currentProg === 100) {
        clearInterval(checkInterval);
        // Re-render to show the actual content
        renderModalContent();
      } else {
        var progressText = content.querySelector(".loading-text");
        var progressBar = content.querySelector(".progress-bar");
        if (progressText) {
          progressText.textContent = `Preloading ${file.type.toUpperCase()}... ${Math.round(
            currentProg
          )}%`;
        }
        if (progressBar) {
          progressBar.style.width = `${currentProg}%`;
        }
      }
    }, 100);
    return; // Exit if file is actively preloading
  }

  // IMAGE Display with cache support
  if (file.type === "image") {
    // 🚀 If already cached from main view — use immediately
    if (preloadedMedia[currentIndex]) {
      content.innerHTML = `<img src="${preloadedMedia[currentIndex]}" alt="${file.name}">`;
      return;
    }

    // Show loading progress if still being preloaded
    if (loadingProgress[currentIndex] < 100) {
      showLoading(content, "IMAGE");
      return;
    }

    // Fallback if no preload done
    content.innerHTML = `<img src="${file.url}" alt="${file.name}">`;
  }

  // VIDEO Display with cache support
  else if (file.type === "video") {
    if (loadingProgress[currentIndex] < 100) {
      showLoading(content, "VIDEO");
      return;
    }
    var video = document.createElement("video");
    video.controls = true;
    video.src = preloadedMedia[currentIndex] || file.url;
    content.innerHTML = "";
    content.appendChild(video);
  }

  // PDF Display with cache support
  else if (file.type === "pdf") {
    var pdfUrl = preloadedMedia[currentIndex] || file.url;
    content.innerHTML = `<object class="pdf-embed" data="${pdfUrl}#toolbar=1" type="application/pdf"></object>`;
  } else if (file.type === "text") {
    if (preloadedMedia[currentIndex]) {
      var textContent = preloadedMedia[currentIndex];
      // Limit preview to first 50000 characters for very large files
      var preview =
        textContent.length > 50000
          ? `${textContent.substring(
              0,
              50000
            )}\n\n... (File truncated for preview. Download to see full content.)`
          : textContent;
      content.innerHTML = `<div class="text-preview">${escapeHtml(
        preview
      )}</div>`;
    }
  } else if (file.type === "csv") {
    if (preloadedMedia[currentIndex]) {
      var csvContent = preloadedMedia[currentIndex];
      var tableHtml = parseCSV(csvContent);
      content.innerHTML = tableHtml;
    }
  } else if (file.type === "excel") {
    if (preloadedMedia[currentIndex]) {
      var arrayBuffer = preloadedMedia[currentIndex];
      var tableHtml = parseExcel(arrayBuffer);
      content.innerHTML = tableHtml;
    }
  } else {
    content.innerHTML = `
      <div class="placeholder-content">
        <svg class="placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          ></path>
        </svg>
        <h3 class="placeholder-title">Preview Not Available</h3>
        <p class="placeholder-desc">
          This file type cannot be previewed directly. Click the download button to view it locally.
        </p>
        <button class="placeholder-download-btn" onclick="downloadCurrentFile()">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            ></path>
          </svg>
          Download File
        </button>
      </div>
    `;
  }
}

function showLoading(container, type) {
  const progress = Math.round(loadingProgress[currentIndex] || 0);
  container.innerHTML = `
      <div class="loading-container">
        <div class="spinner"></div>
        <p class="loading-text">Loading ${type}... ${progress}%</p>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${progress}%"></div>
        </div>
      </div>`;
}

function escapeHtml(text) {
  var map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}

function parseCSV(csvText) {
  var lines = csvText.split("\n");
  var rows = [];

  // Parse CSV with basic handling of quoted values
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "") continue;

    var row = [];
    var current = "";
    var inQuotes = false;

    for (var j = 0; j < lines[i].length; j++) {
      var char = lines[i][j];

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
    return `
      <div class="placeholder-content">
        <p>No data found in CSV file.</p>
      </div>
    `;
  }

  // Limit to first 100 rows for performance
  var maxRows = Math.min(rows.length, 100);
  var headers = rows[0];
  var truncated = rows.length > 100;

  var html = `<div class="csv-preview">`;

  if (truncated) {
    html += `
      <div class="csv-info">
        Showing first 100 rows of ${rows.length} total rows.
        Download file to see all data.
      </div>
    `;
  }

  html += `<table class="csv-table"><thead><tr>`;

  for (var h = 0; h < headers.length; h++) {
    html += `<th>${escapeHtml(headers[h].replace(/^"|"$/g, ""))}</th>`;
  }

  html += `</tr></thead><tbody>`;

  for (var r = 1; r < maxRows; r++) {
    html += `<tr>`;
    for (var c = 0; c < rows[r].length; c++) {
      html += `<td>${escapeHtml(rows[r][c].replace(/^"|"$/g, ""))}</td>`;
    }
    html += `</tr>`;
  }

  html += `</tbody></table></div>`;

  return html;
}

function parseExcel(arrayBuffer) {
  try {
    var workbook = XLSX.read(arrayBuffer, { type: "array" });
    var firstSheetName = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[firstSheetName];
    var data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (data.length === 0) {
      return `
        <div class="placeholder-content">
          <p>No data found in Excel file.</p>
        </div>
      `;
    }

    // Limit to first 100 rows for performance
    var maxRows = Math.min(data.length, 100);
    var truncated = data.length > 100;

    var html = `<div class="excel-preview">`;

    if (workbook.SheetNames.length > 1) {
      html += `
        <div class="excel-info">
          Showing sheet: "${escapeHtml(firstSheetName)}"
          (Total sheets: ${workbook.SheetNames.length})
        </div>
      `;
    }

    if (truncated) {
      html += `
        <div class="excel-info">
          Showing first 100 rows of ${data.length} total rows.
          Download file to see all data.
        </div>
      `;
    }

    html += `<table class="excel-table"><thead><tr>`;

    var headers = data[0];
    for (var h = 0; h < headers.length; h++) {
      var headerValue =
        headers[h] !== undefined && headers[h] !== null
          ? String(headers[h])
          : "";
      html += `<th>${escapeHtml(headerValue)}</th>`;
    }

    html += `</tr></thead><tbody>`;

    for (var r = 1; r < maxRows; r++) {
      html += `<tr>`;
      for (var c = 0; c < data[r].length; c++) {
        var cellValue =
          data[r][c] !== undefined && data[r][c] !== null
            ? String(data[r][c])
            : "";
        html += `<td>${escapeHtml(cellValue)}</td>`;
      }
      html += `</tr>`;
    }

    html += `</tbody></table></div>`;

    return html;
  } catch (e) {
    return `
      <div class="placeholder-content">
        <h3 class="placeholder-title">Error Reading Excel File</h3>
        <p class="placeholder-desc">
          Unable to parse the Excel file. Please download it to view.
        </p>
      </div>
    `;
  }
}

function renderThumbnailStrip() {
  var strip = document.getElementById("thumbnailStrip");

  // Avoid re-render if already exists
  if (strip.childElementCount > 0) {
    updateActiveThumbnailOnly();
    return;
  }

  var html = MEDIA_FILES.map((file, i) => {
    var activeClass = i === currentIndex ? " active" : "";

    var video_icon = "";
    if (file.type === "video") {
      video_icon = `<div class="video_icon_wrapper"><i class="fa fa-play video_icon" aria-hidden="true"></i></div>`;
    }

    return `
      <div class="strip-thumbnail${activeClass}" data-index="${i}" onclick="openModal(${i})">
        <div class="thumb-wrapper">
          ${video_icon}
          <img src="${file.thumbnail}" class="thumbnail-image lazy-thumb" />
        </div>
        ${
          loadingProgress[i] !== undefined
            ? renderProgressIndicatorHtml(i, loadingProgress[i] || 0)
            : ""
        }
      </div>
    `;
  }).join("");

  strip.innerHTML = html;

  // Initial call to update progress indicators after rendering the strip
  MEDIA_FILES.forEach((_, index) => updateThumbnailProgress(index));

  var activeThumb = strip.querySelector(".active");
  if (activeThumb) {
    activeThumb.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  setTimeout(applyLazyPlaceholder, 300);
}

function updateNavButtons() {
  document.getElementById("prevBtn").disabled = currentIndex === 0;
  document.getElementById("nextBtn").disabled =
    currentIndex === MEDIA_FILES.length - 1;
}

function prevFile() {
  if (currentIndex > 0) {
    openModal(currentIndex - 1);
  }
}

function nextFile() {
  if (currentIndex < MEDIA_FILES.length - 1) {
    openModal(currentIndex + 1);
  }
}

function downloadFile(index) {
  var file = MEDIA_FILES[index];
  var link = document.createElement("a");
  link.href = file.url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadCurrentFile() {
  downloadFile(currentIndex);
}

document.addEventListener("keydown", function (e) {
  if (!document.getElementById("modal").classList.contains("active")) {
    return;
  }

  switch (e.key) {
    case "ArrowLeft":
      prevFile();
      break;
    case "ArrowRight":
      nextFile();
      break;
    case "Escape":
      closeModal();
      break;
    case "d":
    case "D":
      downloadCurrentFile();
      break;
  }
});

function applyLazyPlaceholder() {
  const thumbnails = document.querySelectorAll(".lazy-thumb");

  thumbnails.forEach((img, index) => {
    function markLoaded() {
      img.parentElement.classList.add("loaded");

      // 🚀 Cache image if not already stored
      if (!preloadedMedia[index]) {
        preloadedMedia[index] = img.src; // Use the already-loaded image URL
        loadingProgress[index] = 100; // Mark as fully loaded
      }
    }

    img.addEventListener("load", markLoaded);

    if (img.complete) {
      markLoaded();
    }
  });
}

function updateActiveThumbnailOnly() {
  const strip = document.getElementById("thumbnailStrip");

  if (!strip.innerHTML.trim()) {
    renderThumbnailStrip(); // First time modal opened
    return;
  }

  strip.querySelectorAll(".strip-thumbnail").forEach((thumb, i) => {
    if (i === currentIndex) {
      thumb.classList.add("active");
      thumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    } else {
      thumb.classList.remove("active");
    }
  });
}

// Call after grid and strip render
setTimeout(applyLazyPlaceholder, 500);

initGrid();
preloadMedia();
