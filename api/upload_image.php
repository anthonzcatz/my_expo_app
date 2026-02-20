<?php
require_once '_bootstrap.php';
require_once __DIR__ . '/db.php';
$uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/admin/page/user_img/';
$bio_id = $_POST['bio_id'] ?? '';
$filename = $_POST['filename'] ?? '';

// Log for debugging
error_log("Upload request - bio_id: $bio_id, filename: $filename");

if (!empty($_FILES['image'])) {
    $file = $_FILES['image'];
    $targetPath = $uploadDir . $filename;
    
    // Create directory if not exists
    if (!file_exists($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            error_log("Failed to create directory: $uploadDir");
            json_response(['ok' => false, 'error' => 'Cannot create upload directory']);
        } else {
            error_log("Directory created successfully: $uploadDir");
        }
    }
    
    // Log the full target path for debugging
    error_log("Target path: $targetPath");
    error_log("Upload directory: $uploadDir");
    error_log("Document root: " . $_SERVER['DOCUMENT_ROOT']);
    
    // Validate file type
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!in_array($file['type'], $allowedTypes)) {
        json_response(['ok' => false, 'error' => 'Invalid file type. Only JPEG and PNG allowed.']);
    }
    
    // Check file size (max 5MB)
    if ($file['size'] > 5 * 1024 * 1024) {
        json_response(['ok' => false, 'error' => 'File too large. Maximum 5MB allowed.']);
    }
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        error_log("File uploaded successfully: $targetPath");
        
        // Verify file exists at target location
        if (file_exists($targetPath)) {
            error_log("File verified at target location");
            
            // Update database with the new filename
            try {
                // db.php is already included at the top of the file
                $stmt = $pdo->prepare("UPDATE employees SET user_img = ? WHERE emp_id = ?");
                $stmt->execute([$filename, $bio_id]);
                
                if ($stmt->rowCount() > 0) {
                    error_log("Database updated successfully for emp_id: $bio_id");
                    json_response(['ok' => true, 'filename' => $filename, 'path' => $targetPath, 'message' => 'Image uploaded and profile updated']);
                } else {
                    error_log("Database update failed - employee not found: $bio_id");
                    json_response(['ok' => true, 'filename' => $filename, 'path' => $targetPath, 'warning' => 'Image uploaded but database not updated']);
                }
            } catch (PDOException $e) {
                error_log("Database error: " . $e->getMessage());
                json_response(['ok' => true, 'filename' => $filename, 'path' => $targetPath, 'warning' => 'Image uploaded but database update failed']);
            }
        } else {
            error_log("Warning: File move reported success but file not found at target");
            json_response(['ok' => false, 'error' => 'File uploaded but not accessible']);
        }
    } else {
        error_log("Failed to move uploaded file from {$file['tmp_name']} to $targetPath");
        json_response(['ok' => false, 'error' => 'Failed to save file']);
    }
} else {
    error_log("No file uploaded. FILES data: " . print_r($_FILES, true));
    json_response(['ok' => false, 'error' => 'No file uploaded']);
}
?>
