<?php
// download.php: Proxy file downloader for mix_carousal
// Usage: download.php?url=<remote_url>&name=<filename>

if (!isset($_GET['url'])) {
      http_response_code(400);
      echo 'Missing url parameter.';
      exit;
}

$url = $_GET['url'];
$name = isset($_GET['name']) ? $_GET['name'] : basename($url);

// Validate URL (basic check)
if (!filter_var($url, FILTER_VALIDATE_URL)) {
      http_response_code(400);
      echo 'Invalid URL.';
      exit;
}

// Fetch remote file
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$data = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code != 200 || $data === false) {
      http_response_code(404);
      echo 'File not found or could not be downloaded.';
      exit;
}

// Set headers for download
header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . basename($name) . '"');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . strlen($data));

// Output file
echo $data;
exit;
