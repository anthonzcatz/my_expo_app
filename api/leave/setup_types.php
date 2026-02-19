<?php
require_once __DIR__ . '/../db.php';

// Add sample leave types if table is empty
try {
  // Check if leave types exist
  $stmt = $pdo->prepare('SELECT COUNT(*) FROM leave_type');
  $stmt->execute();
  $count = $stmt->fetchColumn();
  
  if ($count == 0) {
    // Insert sample leave types
    $insertStmt = $pdo->prepare('INSERT INTO leave_type (leave_type_name) VALUES (?)');
    $sampleTypes = ['Vacation Leave', 'Sick Leave', 'Personal Leave', 'Maternity Leave', 'Paternity Leave'];
    
    foreach ($sampleTypes as $type) {
      $insertStmt->execute([$type]);
    }
    
    echo "Sample leave types inserted successfully!";
  } else {
    echo "Leave types already exist: " . $count . " records found.";
  }
  
  // Display current leave types
  $stmt = $pdo->prepare('SELECT leave_type_id, leave_type_name FROM leave_type ORDER BY leave_type_name');
  $stmt->execute();
  $types = $stmt->fetchAll();
  
  echo "\n\nCurrent Leave Types:\n";
  foreach ($types as $type) {
    echo "ID: " . $type['leave_type_id'] . " - " . $type['leave_type_name'] . "\n";
  }
  
} catch (Throwable $e) {
  echo "Error: " . $e->getMessage();
}
?>
