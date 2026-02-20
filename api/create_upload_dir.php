<?php
require_once '_bootstrap.php';
require_once __DIR__ . '/db.php';

// This script creates the upload directory if it doesn't exist
$uploadDir = '../admin/page/user_img/';

if (!file_exists($uploadDir)) {
    if (mkdir($uploadDir, 0777, true)) {
        json_response(['ok' => true, 'message' => 'Upload directory created successfully', 'path' => $uploadDir]);
    } else {
        json_response(['ok' => false, 'error' => 'Failed to create upload directory']);
    }
} else {
    json_response(['ok' => true, 'message' => 'Upload directory already exists', 'path' => $uploadDir]);
}
?>
