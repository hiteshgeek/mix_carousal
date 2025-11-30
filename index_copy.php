<?php
include_once __DIR__ . '/includes/functions.php';
?>

<!DOCTYPE html>
<html lang="en">

<head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Mix Carousal - A Carousal for all kind of file types</title>
      <meta
            name="description"
            content="Create a mdern grid for your website and components" />
      <link rel="stylesheet" href="<?php echo asset('main.css'); ?>" />
      <link rel="stylesheet" href="<?php echo asset('mix_carousal.css'); ?>" />

      <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
</head>

<!--ge-debug ge-extra-info-->

<body class=''>

      <div class="demo-header">
            <h1>📸 Media Gallery Library</h1>
            <p>
                  A modern, feature-rich media carousel with preloading & preview support
            </p>
      </div>

      <div class="demo-section">
            <h2>Demo 1: Full Featured Gallery</h2>
            <div class="demo-controls">
                  <button class="demo-btn" onclick="initGallery1()">
                        Initialize Gallery
                  </button>
                  <button class="demo-btn secondary" onclick="destroyGallery1()">
                        Destroy Gallery
                  </button>
            </div>
            <div id="gallery-1"></div>
      </div>

      <div class="demo-section">
            <h2>Demo 2: Images Only (No Auto-Preload)</h2>
            <div class="demo-controls">
                  <button class="demo-btn" onclick="initGallery2()">
                        Initialize Gallery
                  </button>
                  <button class="demo-btn" onclick="manualPreload2()">
                        Manual Preload
                  </button>
            </div>
            <div id="gallery-2"></div>
      </div>

      <div class="demo-section">
            <h2>Demo 3: Mixed - Show All, Preview Images/Videos Only</h2>
            <div id="gallery-3"></div>
      </div>

      <!-- XLSX library for Excel support -->
      <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>

      <script type="module" src="<?= asset('mix_carousal.js') ?>"></script>
      <script nomodule src="<?= asset('mix_carousal.js', 'nomodule') ?>"></script>

      <script type="module" src="<?= asset('main.js') ?>"></script>
      <script nomodule src="<?php echo asset('main.js', 'nomodule'); ?>"></script>
</body>

</html>