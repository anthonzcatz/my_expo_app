<?php
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  json_response(['ok' => false, 'error' => 'METHOD_NOT_ALLOWED'], 405);
}

// Get user from auth session (you'll need to implement session validation)
// For now, we'll get the user_id from the request
$body = read_json_body();
$employeeId = isset($body['employee_id']) ? (int)$body['employee_id'] : 0;
$leaveTypeId = isset($body['leave_type_id']) ? (int)$body['leave_type_id'] : 0;
$startDate = isset($body['start_date']) ? $body['start_date'] : '';
$endDate = isset($body['end_date']) ? $body['end_date'] : '';
$reason = isset($body['reason']) ? trim($body['reason']) : '';

// Validate required fields
if ($employeeId === 0 || $leaveTypeId === 0 || $startDate === '' || $endDate === '' || $reason === '') {
  json_response(['ok' => false, 'error' => 'MISSING_FIELDS'], 400);
}

// Validate dates
if (!strtotime($startDate) || !strtotime($endDate)) {
  json_response(['ok' => false, 'error' => 'INVALID_DATE'], 400);
}

if (strtotime($startDate) > strtotime($endDate)) {
  json_response(['ok' => false, 'error' => 'END_DATE_BEFORE_START'], 400);
}

try {
  // Generate UUID
  $uuid = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
    mt_rand(0, 0xffff), mt_rand(0, 0xffff),
    mt_rand(0, 0xffff),
    mt_rand(0, 0x0fff) | 0x4000,
    mt_rand(0, 0x3fff) | 0x8000,
    mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
  );

  // Insert leave application
  $stmt = $pdo->prepare(
    'INSERT INTO leave_applications (
      uuid, leave_employee_id, leave_type_id, start_date, end_date,
      start_half, end_half, half_type, leave_pay, reason, status,
      leaveform_addedby, created_at, source
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)'
  );

  $stmt->execute([
    $uuid,
    $employeeId,
    $leaveTypeId,
    $startDate,
    $endDate,
    'none', // start_half
    'none', // end_half
    'none', // half_type
    'paid', // leave_pay (default)
    $reason,
    'pending', // status
    $employeeId, // leaveform_addedby
    'mobile' // source
  ]);

  $leaveId = $pdo->lastInsertId();

  // Get leave type name for response
  $typeStmt = $pdo->prepare('SELECT leave_type_name FROM leave_type WHERE leave_type_id = ?');
  $typeStmt->execute([$leaveTypeId]);
  $leaveType = $typeStmt->fetchColumn();

  json_response([
    'ok' => true,
    'leave' => [
      'leave_id' => (int)$leaveId,
      'uuid' => $uuid,
      'employee_id' => $employeeId,
      'leave_type_id' => $leaveTypeId,
      'leave_type_name' => $leaveType,
      'start_date' => $startDate,
      'end_date' => $endDate,
      'reason' => $reason,
      'status' => 'pending',
      'created_at' => date('Y-m-d H:i:s')
    ]
  ]);

} catch (Throwable $e) {
  error_log('Leave application error: ' . $e->getMessage());
  json_response(['ok' => false, 'error' => 'SERVER_ERROR'], 500);
}
