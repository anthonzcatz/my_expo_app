<?php
require_once __DIR__ . '/_bootstrap.php';

// Database configuration - Switch between offline and online
$USE_ONLINE_DB = true; // Set to false for offline/local database

// Base URL configuration - Auto-detect if online or localhost
$BASE_URL = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
$BASE_PATH = rtrim(dirname($_SERVER['PHP_SELF']), '/');

// Define constants for frontend use
define('API_BASE_URL', $BASE_URL . $BASE_PATH);

if ($USE_ONLINE_DB) {
  // Online database credentials - Hostinger specific
  $DB_HOST = getenv('DB_HOST') ?: 'localhost';
  $DB_NAME = getenv('DB_NAME') ?: 'u861050830_cstdcDB';
  $DB_USER = getenv('DB_USER') ?: 'u861050830_anthonzcatz';
  $DB_PASS = getenv('DB_PASS') ?: 'ayYbFZcstdcanthnz';
  
  // Additional connection options for Hostinger
  $DB_OPTIONS = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
  ];
} else {
  // Offline/local database credentials
  // $DB_HOST = '127.0.0.1';
  // $DB_NAME = 'cstdc_main';
  // $DB_USER = 'root';
  // $DB_PASS = '';
}

try {
  $pdo = new PDO(
    "mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4",
    $DB_USER,
    $DB_PASS,
    $DB_OPTIONS ?? [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
  );
  
  // Log which database is being used (for debugging)
  error_log("Using database: " . ($USE_ONLINE_DB ? "ONLINE - {$DB_HOST}/{$DB_NAME}" : "OFFLINE - {$DB_HOST}/{$DB_NAME}"));
  error_log("API Base URL: " . API_BASE_URL);
  
} catch (Throwable $e) {
  error_log("Database connection failed: " . $e->getMessage());
  json_response([
    'ok' => false,
    'error' => 'DB_CONNECTION_FAILED',
    'details' => $USE_ONLINE_DB ? 'Online database unavailable' : 'Local database unavailable'
  ], 500);
}
