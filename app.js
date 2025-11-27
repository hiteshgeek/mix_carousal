// --- 1. FILE DATA MODEL ---
const EXCEL_ICON = "media/file_type_excel.png";
const CSV_ICON = "media/file_type_excel.png";
const PDF_ICON = "media/file_type_pdf.png";
const TEXT_ICON = "media/file_type_text.png";

const mediaFiles = [
  // Image (Supported)
  {
    id: 1,
    type: "image",
    thumbnail: "https://picsum.photos/id/10/150/150",
    url: "https://picsum.photos/id/10/800/600",
    name: "RandomImage.jpg",
  },
  // Video (Supported)
  {
    id: 2,
    type: "video",
    thumbnail: "https://i.imgur.com/Gj8V35J.png",
    url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    name: "BigBuckBunny.mp4",
  },
  // PDF (Supported via iframe, uses icon as thumbnail)
  {
    id: 3,
    type: "pdf",
    thumbnail: PDF_ICON,
    url: "https://pdfobject.com/pdf/sample.pdf",
    name: "SampleReport.pdf",
  },
  // Excel (Unsupported for preview, uses icon)
  {
    id: 4,
    type: "excel",
    thumbnail: EXCEL_ICON,
    url: "https://www.cmu.edu/blackboard/files/evaluate/tests-example.xls",
    name: "TestQuestions.xls",
  },
  // CSV (Unsupported for preview, uses icon)
  {
    id: 5,
    type: "csv",
    thumbnail: CSV_ICON,
    url: "https://download.microsoft.com/download/5/B/2/5B2108F8-112B-4913-A761-38AFF2FD8598/Sample%20CSV%20file%20for%20importing%20contacts.csv",
    name: "SampleContacts.csv",
  },
  // Text (Unsupported for preview, uses icon)
  {
    id: 6,
    type: "text",
    thumbnail: TEXT_ICON,
    url: "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt",
    name: "WordsList.txt",
  },
];

// --- 2. DOM ELEMENTS & STATE ---
const mediaGrid = document.getElementById("mediaGrid");
const modal = document.getElementById("carouselModal");
const modalContent = document.getElementById("modalContent");
const modalFileName = document.getElementById("modalFileName");
const modalDownloadLink = document.getElementById("modalDownloadLink");

// STATE VARIABLE for carousel position
let currentFileIndex = 0;

// --- 3. CAROUSEL/MODAL LOGIC ---

/**
 * Creates the appropriate HTML element for the media preview based on file type.
 */
function renderMedia(file) {
  modalContent.innerHTML = "";
  modalContent.style.backgroundColor = "#000"; // Default dark background for media

  if (file.type === "image") {
    const img = document.createElement("img");
    img.src = file.url;
    img.alt = file.name;
    modalContent.appendChild(img);
  } else if (file.type === "video") {
    const video = document.createElement("video");
    video.controls = true;
    video.autoplay = true;
    video.src = file.url;
    modalContent.appendChild(video);
  } else if (file.type === "pdf") {
    const iframe = document.createElement("iframe");
    iframe.src = file.url;
    iframe.style.width = "100%";
    iframe.style.height = "100%"; // Set to 100% since carousel-wrapper controls the height
    modalContent.appendChild(iframe);
    modalContent.style.backgroundColor = "#fefefe";
  } else {
    // Placeholder for unsupported types
    const placeholder = document.createElement("div");
    placeholder.className = "placeholder-content";
    placeholder.innerHTML = `
            <img src="${file.thumbnail}" alt="${file.type} icon">
            <h2>File Type: ${file.type.toUpperCase()}</h2>
            <p>This file type cannot be previewed directly in the browser carousel.</p>
            <p>Please use the <strong>Download File</strong> button below to view it.</p>
        `;
    modalContent.appendChild(placeholder);
    modalContent.style.backgroundColor = "#1e1e1e"; // Use primary background for placeholder
  }

  // Update the footer details
  modalFileName.textContent = file.name;
  // Only set download link if modalDownloadLink exists
  if (modalDownloadLink) {
    modalDownloadLink.href = file.url;
    modalDownloadLink.setAttribute("download", file.name);
  }
}

/**
 * Renders the thumbnail strip inside the modal.
 */
function renderThumbnailStrip() {
  const thumbnailStrip = document.getElementById("modalThumbnailStrip");

  thumbnailStrip.innerHTML = mediaFiles
    .map(
      (file, index) => `
        <div class="strip-thumb-item${
          index === currentFileIndex ? " active" : ""
        }" style="position:relative;display:inline-block;">
          <img 
            src="${file.thumbnail || file.url}" 
            alt="${file.name}" 
            class="strip-thumbnail${
              index === currentFileIndex ? " active" : ""
            }"
            onclick="showMedia(${index})"
            style="cursor:pointer;"
          >
          <button class="download-thumb-btn" style="position:absolute;top:4px;right:4px;display:none;" onclick="event.stopPropagation();(function(){const a=document.createElement('a');a.href='${
            file.url
          }';a.download='${
        file.name
      }';document.body.appendChild(a);a.click();document.body.removeChild(a);})()"><i class="fa fa-download"></i></button>
        </div>
      `
    )
    .join("");

  // Show download button on hover/active
  Array.from(thumbnailStrip.querySelectorAll(".strip-thumb-item")).forEach(
    (item, idx) => {
      item.addEventListener("mouseenter", function () {
        item.querySelector(".download-thumb-btn").style.display = "flex";
      });
      item.addEventListener("mouseleave", function () {
        if (!item.classList.contains("active")) {
          item.querySelector(".download-thumb-btn").style.display = "none";
        }
      });
      if (idx === currentFileIndex) {
        item.querySelector(".download-thumb-btn").style.display = "flex";
      }
    }
  );

  // Scroll the active thumbnail into view
  const activeThumb = thumbnailStrip.querySelector(".active");
  if (activeThumb) {
    activeThumb.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
}

/**
 * Displays media for a given index, updates navigation, and refreshes the strip.
 */
window.showMedia = function (index) {
  if (index < 0 || index >= mediaFiles.length) return;

  // Stop video playback on current media before changing
  const videoElement = modalContent.querySelector("video");
  if (videoElement) {
    videoElement.pause();
  }

  // Fade out current media
  if (modalContent.firstChild) {
    modalContent.firstChild.style.opacity = 0;
    setTimeout(() => {
      currentFileIndex = index;
      const file = mediaFiles[currentFileIndex];
      renderMedia(file);
      updateNavigationButtons();
      renderThumbnailStrip();
    }, 200);
  } else {
    currentFileIndex = index;
    const file = mediaFiles[currentFileIndex];
    renderMedia(file);
    updateNavigationButtons();
    renderThumbnailStrip();
  }
};

/**
 * Updates the state of the Next/Prev buttons (disabled status).
 */
function updateNavigationButtons() {
  const prevBtn = document.getElementById("prevButton");
  const nextBtn = document.getElementById("nextButton");

  prevBtn.disabled = currentFileIndex === 0;
  nextBtn.disabled = currentFileIndex === mediaFiles.length - 1;
}

/**
 * Navigates to the previous item.
 */
window.prevMedia = function () {
  if (currentFileIndex > 0) {
    showMedia(currentFileIndex - 1);
  }
};

/**
 * Navigates to the next item.
 */
window.nextMedia = function () {
  if (currentFileIndex < mediaFiles.length - 1) {
    showMedia(currentFileIndex + 1);
  }
};

/**
 * Opens the carousel modal (triggered by grid click).
 */
window.openCarousel = function (fileId) {
  const fileIndex = mediaFiles.findIndex((f) => f.id === fileId);
  if (fileIndex === -1) return;

  showMedia(fileIndex); // Show the clicked media
  $("#carouselModal").modal("show");
};

/**
 * Closes the carousel modal.
 */
window.closeCarousel = function (event) {
  // Only close if clicking the close button or the modal background
  if (
    event.target.classList.contains("close") ||
    event.target.classList.contains("modal") ||
    event.target.id === "carouselModal"
  ) {
    $("#carouselModal").modal("hide");
    // Stop playback for video when closing
    const videoElement = modalContent.querySelector("video");
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  }
};

// --- 4. INITIALIZATION ---

/**
 * Creates a thumbnail element for the file.
 */
function createThumbnail(file) {
  const item = document.createElement("div");
  item.className = "thumbnail-item";
  item.setAttribute("onclick", `openCarousel(${file.id})`);

  const container = document.createElement("div");
  container.className = "thumbnail-container";

  const mediaElement = document.createElement("img");
  mediaElement.src = file.thumbnail || file.url;
  mediaElement.alt = file.name + " thumbnail";

  // Download button (hidden by default, visible on hover/active)
  const downloadBtn = document.createElement("button");
  downloadBtn.className = "download-thumb-btn";
  downloadBtn.innerHTML = '<i class="fa fa-download"></i>';
  downloadBtn.title = "Download";
  downloadBtn.onclick = function (e) {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  container.appendChild(downloadBtn);
  container.appendChild(mediaElement);

  const name = document.createElement("div");
  name.className = "file-name";
  name.textContent = file.name;

  item.appendChild(container);
  item.appendChild(name);
  return item;
}

// Populate the grid on page load
document.addEventListener("DOMContentLoaded", () => {
  mediaFiles.forEach((file) => {
    mediaGrid.appendChild(createThumbnail(file));
  });
});

// Keyboard navigation and actions
// Use Bootstrap modal 'in' class for visibility check
$(document).on("keydown", function (e) {
  if (!$("#carouselModal").hasClass("in")) return;
  switch (e.key) {
    case "ArrowLeft":
      prevMedia();
      break;
    case "ArrowRight":
      nextMedia();
      break;
    case "Escape":
      closeCarousel({ target: modal });
      break;
    case "d":
    case "D": {
      // Download current file (force download for all types)
      if (mediaFiles[currentFileIndex]) {
        var url = mediaFiles[currentFileIndex].url;
        var filename = mediaFiles[currentFileIndex].name;
        // Use fetch and blob for cross-origin and non-image files
        fetch(url, { mode: "cors" })
          .then(function (response) {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.blob();
          })
          .then(function (blob) {
            var blobUrl = window.URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.style.display = "none";
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(blobUrl);
            }, 200);
          })
          .catch(function () {
            // fallback: open in new tab if download fails
            window.open(url, "_blank");
          });
      }
      break;
    }
  }
});
