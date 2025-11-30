// main.js

if (typeof window !== "undefined") {
  window.MixCarousal = MixCarousal;
}

// Complete media files from app.js
const mediaFiles = [
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

// Initialize gallery
const gallery = new MixCarousal({
  container: document.getElementById("gallery"),
  files: mediaFiles,
  autoPreload: false,
  enableManualLoading: true,
  showShortcuts: true,
  maxPreviewRows: 100,
  maxTextPreviewChars: 50000,
  // visibleTypes: ["image", "video", "pdf"],
  // previewableTypes: ["image"],
});
