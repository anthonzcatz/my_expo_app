<?php
require_once '_bootstrap.php';
require_once __DIR__ . '/db.php';

$data = read_json_body();
$emp_id = $data['emp_id'] ?? '';
$user_img = $data['user_img'] ?? '';

// Log for debugging
error_log("Profile update request - emp_id: $emp_id, user_img: $user_img");

if (empty($emp_id) || empty($user_img)) {
    json_response(['ok' => false, 'error' => 'Missing emp_id or user_img']);
}

try {
    // Update employees table
    $stmt = $pdo->prepare("UPDATE employees SET user_img = ? WHERE emp_id = ?");
    $stmt->execute([$user_img, $emp_id]);
    
    if ($stmt->rowCount() > 0) {
        error_log("Profile updated successfully for emp_id: $emp_id");
        json_response(['ok' => true, 'message' => 'Profile updated successfully']);
    } else {
        error_log("No employee found with emp_id: $emp_id");
        json_response(['ok' => false, 'error' => 'Employee not found or no changes made']);
    }
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    json_response(['ok' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>
