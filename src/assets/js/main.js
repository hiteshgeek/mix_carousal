if (typeof window !== "undefined") {
  window.MixCarousal = MixCarousal;
}

// Sample media files
const sampleFiles = [
  {
    name: "Mountain Landscape.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200",
  },
  {
    name: "Ocean Sunset.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200",
  },
  {
    name: "City Night.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=200",
  },
  {
    name: "Forest Trail.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200",
  },
  {
    name: "Sample Video.mp4",
    type: "video",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200",
  },
  {
    name: "Desert Dunes.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=200",
  },
];

// Initialize gallery
const gallery = new MixCarousal({
  container: document.getElementById("gallery"),
  files: sampleFiles,
});
