<?php
require_once __DIR__ . '/../_bootstrap.php';
require_once __DIR__ . '/../db.php';

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  json_response(['ok' => false, 'error' => 'METHOD_NOT_ALLOWED'], 405);
}

// Get bio_id from query parameter
$bio_id = isset($_GET['bio_id']) ? (int)$_GET['bio_id'] : 0;

if ($bio_id === 0) {
  json_response(['ok' => false, 'error' => 'MISSING_BIO_ID'], 400);
}

try {
  // Check if database connection is available
  if (!isset($pdo)) {
    json_response(['ok' => false, 'error' => 'DB_CONNECTION_FAILED'], 500);
  }

  // Query employee data with all joins - simplified version first
  $sql = "SELECT e.emp_id, e.first_name, e.last_name, e.middle_name, e.b_date, e.date_hired, 
          e.b_permanent_address, e.emp_street_address, e.emp_province_code, e.emp_city_code, e.emp_barangay_code,
          e.b_cont_no, e.b_citizenship, e.b_placebirth, e.b_religion, e.b_sex, e.b_civil_status,
          e.b_height, e.b_weight, e.job_title, e.b_address, e.b_email, e.daily_rate, e.cola,
          e.b_department_id, e.b_sub_department_id, e.b_company_id, e.b_employment_status_id,
          e.b_philhealth, e.b_sss, e.b_pagibig, e.b_tinnumber, e.emergency_contact_name,
          e.emergency_contact_relationship, e.emergency_contact_number, e.remarks,
          e.notifications, e.user_img, e.type, e.b_addedby, e.b_dateadded, e.employment_remarks,
          p.position_name,
          d.department_name,
          sd.sub_department_name,
          es.emp_stat_name,
          added_by_emp.first_name as added_by_first_name,
          added_by_emp.last_name as added_by_last_name,
          added_by_emp.middle_name as added_by_middle_name
   FROM employees e
   LEFT JOIN position p ON p.pos_id = e.job_title
   LEFT JOIN department d ON d.dept_id = e.b_department_id
   LEFT JOIN sub_department sd ON sd.sub_depart_id = e.b_sub_department_id
   LEFT JOIN employment_status es ON es.emp_stat_id = e.b_employment_status_id
   LEFT JOIN employees added_by_emp ON added_by_emp.emp_id = e.b_addedby
   WHERE e.emp_id = :bio_id
   LIMIT 1";
  
  $stmt = $pdo->prepare($sql);
  
  if (!$stmt) {
    json_response(['ok' => false, 'error' => 'PREPARE_FAILED', 'details' => 'Failed to prepare SQL statement'], 500);
  }
  
  $result = $stmt->execute([':bio_id' => $bio_id]);
  
  if (!$result) {
    json_response(['ok' => false, 'error' => 'EXECUTE_FAILED', 'details' => 'Failed to execute SQL statement'], 500);
  }
  
  $employee = $stmt->fetch();

  if (!$employee) {
    json_response(['ok' => false, 'error' => 'EMPLOYEE_NOT_FOUND'], 404);
  }

  // Format the response
  json_response([
    'ok' => true,
    'employee' => [
      'emp_id' => (int)$employee['emp_id'],
      'first_name' => $employee['first_name'],
      'last_name' => $employee['last_name'],
      'middle_name' => $employee['middle_name'],
      'b_date' => $employee['b_date'],
      'date_hired' => $employee['date_hired'],
      'b_permanent_address' => $employee['b_permanent_address'],
      'emp_street_address' => $employee['emp_street_address'],
      'emp_province_code' => $employee['emp_province_code'],
      'emp_city_code' => $employee['emp_city_code'],
      'emp_barangay_code' => $employee['emp_barangay_code'],
      'b_cont_no' => $employee['b_cont_no'],
      'b_citizenship' => $employee['b_citizenship'],
      'b_placebirth' => $employee['b_placebirth'],
      'b_religion' => $employee['b_religion'],
      'b_sex' => $employee['b_sex'],
      'b_civil_status' => $employee['b_civil_status'],
      'b_height' => $employee['b_height'],
      'b_weight' => $employee['b_weight'],
      'job_title' => (int)$employee['job_title'],
      'b_address' => $employee['b_address'],
      'b_email' => $employee['b_email'],
      'daily_rate' => (int)$employee['daily_rate'],
      'cola' => (int)$employee['cola'],
      'b_department_id' => (int)$employee['b_department_id'],
      'b_sub_department_id' => $employee['b_sub_department_id'] ? (int)$employee['b_sub_department_id'] : null,
      'b_company_id' => (int)$employee['b_company_id'],
      'b_employment_status_id' => (int)$employee['b_employment_status_id'],
      'b_philhealth' => $employee['b_philhealth'],
      'b_sss' => $employee['b_sss'],
      'b_pagibig' => $employee['b_pagibig'],
      'b_tinnumber' => $employee['b_tinnumber'],
      'emergency_contact_name' => $employee['emergency_contact_name'],
      'emergency_contact_relationship' => $employee['emergency_contact_relationship'],
      'emergency_contact_number' => $employee['emergency_contact_number'],
      'remarks' => $employee['remarks'],
      'notifications' => (int)$employee['notifications'],
      'user_img' => $employee['user_img'],
      'type' => $employee['type'],
      'b_addedby' => (int)$employee['b_addedby'],
      'b_dateadded' => $employee['b_dateadded'],
      'employment_remarks' => $employee['employment_remarks'],
      // Added by employee name
      'added_by_name' => $employee['b_addedby'] ? 
        trim($employee['added_by_first_name'] . ' ' . ($employee['added_by_middle_name'] ? $employee['added_by_middle_name'] . '. ' : '') . $employee['added_by_last_name']) : 
        'System',
      // Joined data
      'position_name' => $employee['position_name'],
      'department_name' => $employee['department_name'],
      'sub_department_name' => $employee['sub_department_name'],
      'employment_status_name' => $employee['emp_stat_name']
    ]
  ]);

} catch (Throwable $e) {
  error_log('Profile fetch error: ' . $e->getMessage());
  error_log('Profile fetch error trace: ' . $e->getTraceAsString());
  json_response(['ok' => false, 'error' => 'SERVER_ERROR', 'details' => $e->getMessage()], 500);
}
