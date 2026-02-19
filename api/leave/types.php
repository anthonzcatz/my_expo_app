<?php
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  json_response(['ok' => false, 'error' => 'METHOD_NOT_ALLOWED'], 405);
}

try {
  $stmt = $pdo->prepare('SELECT leave_type_id, TRIM(leave_type_name) AS leave_type_name FROM leave_type ORDER BY TRIM(leave_type_name)');
  $stmt->execute();
  $leaveTypes = $stmt->fetchAll();

  json_response([
    'ok' => true,
    'leave_types' => array_map(function($type) {
      return [
        'leave_type_id' => (int)$type['leave_type_id'],
        'leave_type_name' => trim((string)$type['leave_type_name'])
      ];
    }, $leaveTypes)
  ]);

} catch (Throwable $e) {
  error_log('Get leave types error: ' . $e->getMessage());
  json_response(['ok' => false, 'error' => 'SERVER_ERROR'], 500);
}
