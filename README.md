# 📸 Media Gallery Library

A modern, modular, and feature-rich JavaScript library for creating beautiful media carousels with preloading, preview support, and extensive customization options.

## ✨ Features

- 🎨 **Modern UI** - Beautiful gradient design with glass-morphism effects
- 🚀 **Smart Preloading** - Optional automatic or manual file preloading with progress indicators
- 🖼️ **Multiple File Types** - Support for images, videos, PDFs, Excel, CSV, and text files
- 🎯 **Flexible Configuration** - Control which files appear and which can be previewed
- ⚡ **ES6 Modules** - Clean, maintainable code structure
- 📱 **Responsive** - Works beautifully on all screen sizes
- ⌨️ **Keyboard Navigation** - Full keyboard shortcut support
- 🎭 **Modal Preview** - Immersive full-screen preview experience
- 🔄 **Dynamic Updates** - Update files on the fly
- 🧹 **Memory Management** - Proper cleanup and resource management

## 📦 Installation

### Option 1: Direct Download

Download the library files and include them in your project:

```
media-gallery/
├── MediaGallery.js
├── MediaPreloader.js
├── MediaRenderer.js
├── ModalController.js
└── media-gallery.scss (or compiled .css)
```

### Option 2: CDN (if hosted)

```html
<link rel="stylesheet" href="path/to/media-gallery.css" />
<script type="module" src="path/to/MediaGallery.js"></script>
```

## 🚀 Quick Start

### 1. Include Required Files

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="path/to/media-gallery.css" />
    <!-- Optional: Font Awesome for icons -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <!-- Optional: XLSX for Excel support -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
  </head>
  <body>
    <div id="gallery-container"></div>

    <script type="module">
      import MediaGallery from "./MediaGallery.js";

      // Your code here
    </script>
  </body>
</html>
```

### 2. Prepare Your Media Files

```javascript
const mediaFiles = [
  {
    id: 1,
    type: "image",
    thumbnail: "https://example.com/thumb1.jpg",
    url: "https://example.com/image1.jpg",
    name: "Beautiful Landscape.jpg",
  },
  {
    id: 2,
    type: "video",
    thumbnail: "https://example.com/thumb2.jpg",
    url: "https://example.com/video.mp4",
    name: "My Video.mp4",
  },
  // ... more files
];
```

### 3. Initialize the Gallery

```javascript
const gallery = new MediaGallery({
  container: document.getElementById("gallery-container"),
  files: mediaFiles,
});
```

## 🎛️ Configuration Options

### Core Options

| Option                | Type        | Default                                             | Description                                 |
| --------------------- | ----------- | --------------------------------------------------- | ------------------------------------------- |
| `container`           | HTMLElement | **required**                                        | DOM element to render gallery into          |
| `files`               | Array       | **required**                                        | Array of file objects (see structure below) |
| `autoPreload`         | Boolean     | `true`                                              | Start preloading files immediately          |
| `visibleTypes`        | Array       | `['image', 'video', 'pdf', 'excel', 'csv', 'text']` | File types to show in carousel              |
| `previewableTypes`    | Array       | `['image', 'video', 'pdf', 'excel', 'csv', 'text']` | File types that can be previewed            |
| `showShortcuts`       | Boolean     | `true`                                              | Show keyboard shortcuts panel               |
| `thumbnailSize`       | Number      | `200`                                               | Thumbnail size in pixels                    |
| `maxPreviewRows`      | Number      | `100`                                               | Max rows for CSV/Excel preview              |
| `maxTextPreviewChars` | Number      | `50000`                                             | Max characters for text preview             |

### Callbacks

| Callback         | Parameters      | Description                      |
| ---------------- | --------------- | -------------------------------- |
| `onFileClick`    | `(file, index)` | Called when a file is clicked    |
| `onFileDownload` | `(file, index)` | Called when a file is downloaded |

### File Object Structure

```javascript
{
  id: Number|String,     // Unique identifier
  type: String,          // 'image', 'video', 'pdf', 'excel', 'csv', 'text'
  thumbnail: String,     // URL to thumbnail image
  url: String,           // URL to actual file
  name: String,          // Display name
}
```

## 💡 Usage Examples

### Example 1: Basic Usage

```javascript
const gallery = new MediaGallery({
  container: document.getElementById("gallery"),
  files: mediaFiles,
});
```

### Example 2: Disable Auto-Preload

```javascript
const gallery = new MediaGallery({
  container: document.getElementById("gallery"),
  files: mediaFiles,
  autoPreload: false, // Don't preload immediately
});

// Manually trigger preloading later
gallery.preloadFiles();
```

### Example 3: Show Only Specific File Types

```javascript
const gallery = new MediaGallery({
  container: document.getElementById("gallery"),
  files: mediaFiles,
  visibleTypes: ["image", "video"], // Only show images and videos
});
```

### Example 4: Control Preview Availability

```javascript
const gallery = new MediaGallery({
  container: document.getElementById("gallery"),
  files: mediaFiles,
  visibleTypes: ["image", "video", "pdf", "excel"], // Show all these
  previewableTypes: ["image", "video"], // But only preview images & videos
  // PDFs and Excel will show "Preview Not Available" message
});
```

### Example 5: Custom Callbacks

```javascript
const gallery = new MediaGallery({
  container: document.getElementById("gallery"),
  files: mediaFiles,

  onFileClick: (file, index) => {
    console.log(`Clicked: ${file.name} at index ${index}`);
    // Custom logic here
  },

  onFileDownload: (file, index) => {
    console.log(`Downloading: ${file.name}`);
    // Custom download logic (e.g., tracking, authentication)
  },
});
```

### Example 6: Dynamic File Updates

```javascript
const gallery = new MediaGallery({
  container: document.getElementById("gallery"),
  files: [],
});

// Later, update with new files
fetch("/api/files")
  .then((res) => res.json())
  .then((newFiles) => {
    gallery.updateFiles(newFiles);
  });
```

### Example 7: Cleanup

```javascript
const gallery = new MediaGallery({
  container: document.getElementById("gallery"),
  files: mediaFiles,
});

// When no longer needed
gallery.destroy(); // Cleans up resources and event listeners
```

## ⌨️ Keyboard Shortcuts

When the modal is open:

| Key   | Action                |
| ----- | --------------------- |
| `←`   | Previous file         |
| `→`   | Next file             |
| `Esc` | Close modal           |
| `D`   | Download current file |

## 🎨 Customization

### SCSS Variables

You can customize the appearance by modifying the SCSS variables in `media-gallery.scss`:

```scss
// Colors
$color-primary: #3b82f6;
$color-secondary: #8b5cf6;
$color-accent: #ec4899;

// Spacing
$border-radius: 1rem;
$border-radius-sm: 0.5rem;

// Transitions
$transition-fast: 0.2s;
$transition-normal: 0.3s;
```

### Custom Styling

Add your own CSS classes or override existing ones:

```css
/* Custom thumbnail hover effect */
.mg-thumbnail-card:hover {
  border-color: #ff0000 !important;
  transform: scale(1.05) !important;
}

/* Custom modal background */
.mg-modal.mg-active {
  background: rgba(0, 0, 0, 0.98);
}
```

## 📁 File Type Support

| Type    | Preview | Notes                                      |
| ------- | ------- | ------------------------------------------ |
| `image` | ✅ Yes  | JPG, PNG, GIF, WebP, etc.                  |
| `video` | ✅ Yes  | MP4, WebM, OGG (browser-supported formats) |
| `pdf`   | ✅ Yes  | Using browser's native PDF viewer          |
| `excel` | ✅ Yes  | Requires XLSX library                      |
| `csv`   | ✅ Yes  | Native parsing, up to 100 rows by default  |
| `text`  | ✅ Yes  | TXT files, up to 50,000 chars by default   |

## 🏗️ Project Structure

```
media-gallery/
├── MediaGallery.js          # Main library class
├── MediaPreloader.js        # Handles file preloading
├── MediaRenderer.js         # Renders different file types
├── ModalController.js       # Manages modal behavior
├── media-gallery.scss       # Styles (SCSS)
├── usage-example.js         # Usage examples
├── index.html              # Demo page
└── README.md               # Documentation
```

## 🔧 API Methods

### `new MediaGallery(options)`

Creates a new gallery instance.

### `gallery.preloadFiles()`

Manually trigger file preloading.

### `gallery.updateFiles(files)`

Update the gallery with new files.

```javascript
gallery.updateFiles([
  { id: 1, type: "image", thumbnail: "...", url: "...", name: "..." },
  // ... more files
]);
```

### `gallery.destroy()`

Cleanup resources and remove event listeners.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Dependencies

### Required

- None (vanilla JavaScript)

### Optional

- **XLSX** (0.18.5+) - For Excel file preview support
- **Font Awesome** (4.7.0+) - For video play icons

## 🐛 Troubleshooting

### Excel files not showing preview

Make sure to include the XLSX library before initializing the gallery:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
```

### Images not loading

Check that:

1. URLs are correct and accessible
2. CORS is properly configured for external images
3. Images are in supported formats

### Styles not applying

Ensure the CSS file is properly linked and loaded before the gallery initializes.

## 📄 License

MIT License - feel free to use in personal and commercial projects.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📞 Support

For issues and questions, please open an issue on the repository.

---

Made with ❤️ for modern web applications
