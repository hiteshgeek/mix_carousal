import { MixCarousal } from "./components/MixCarousal.js";

export { MixCarousal };

// Expose GridEngine class directly for IIFE build
if (typeof window !== "undefined") {
  window.MixCarousal = MixCarousal;
}
