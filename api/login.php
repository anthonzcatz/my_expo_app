<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  json_response(['ok' => false, 'error' => 'METHOD_NOT_ALLOWED'], 405);
}

$body = read_json_body();
$username = isset($body['username']) ? trim((string)$body['username']) : '';
$password = isset($body['password']) ? (string)$body['password'] : '';

if ($username === '' || $password === '') {
  json_response(['ok' => false, 'error' => 'MISSING_FIELDS'], 400);
}

try {
  // NOTE: Enhanced query with proper joins for complete employee data
  $stmt = $pdo->prepare(
    'SELECT u.user_id, u.user_name, u.pass, u.status, u.bio_id,
            e.emp_id, e.first_name, e.last_name, e.middle_name, e.b_date, e.date_hired, 
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
     FROM users u
     LEFT JOIN employees e ON e.emp_id = u.bio_id
     LEFT JOIN position p ON p.pos_id = e.job_title
     LEFT JOIN department d ON d.dept_id = e.b_department_id
     LEFT JOIN sub_department sd ON sd.sub_depart_id = e.b_sub_department_id
     LEFT JOIN employment_status es ON es.emp_stat_id = e.b_employment_status_id
     LEFT JOIN employees added_by_emp ON added_by_emp.emp_id = e.b_addedby
     WHERE u.user_name = :username
     LIMIT 1'
  );
  $stmt->execute([':username' => $username]);
  $user = $stmt->fetch();

  if (!$user) {
    json_response(['ok' => false, 'error' => 'INVALID_CREDENTIALS'], 401);
  }

  if ((int)$user['status'] !== 1) {
    json_response(['ok' => false, 'error' => 'ACCOUNT_DISABLED'], 403);
  }

  $hash = (string)$user['pass'];
  if (!password_verify($password, $hash)) {
    json_response(['ok' => false, 'error' => 'INVALID_CREDENTIALS'], 401);
  }

  unset($user['pass']);

  json_response([
    'ok' => true,
    'user' => [
      'user_id' => (int)$user['user_id'],
      'user_name' => $user['user_name'],
      'bio_id' => (int)$user['bio_id'],
      'employee' => [
        'emp_id' => (int)$user['emp_id'],
        'first_name' => $user['first_name'],
        'last_name' => $user['last_name'],
        'middle_name' => $user['middle_name'],
        'b_date' => $user['b_date'],
        'date_hired' => $user['date_hired'],
        'b_permanent_address' => $user['b_permanent_address'],
        'emp_street_address' => $user['emp_street_address'],
        'emp_province_code' => $user['emp_province_code'],
        'emp_city_code' => $user['emp_city_code'],
        'emp_barangay_code' => $user['emp_barangay_code'],
        'b_cont_no' => $user['b_cont_no'],
        'b_citizenship' => $user['b_citizenship'],
        'b_placebirth' => $user['b_placebirth'],
        'b_religion' => $user['b_religion'],
        'b_sex' => $user['b_sex'],
        'b_civil_status' => $user['b_civil_status'],
        'b_height' => $user['b_height'],
        'b_weight' => $user['b_weight'],
        'job_title' => (int)$user['job_title'],
        'b_address' => $user['b_address'],
        'b_email' => $user['b_email'],
        'daily_rate' => (int)$user['daily_rate'],
        'cola' => (int)$user['cola'],
        'b_department_id' => (int)$user['b_department_id'],
        'b_sub_department_id' => $user['b_sub_department_id'] ? (int)$user['b_sub_department_id'] : null,
        'b_company_id' => (int)$user['b_company_id'],
        'b_employment_status_id' => (int)$user['b_employment_status_id'],
        'b_philhealth' => $user['b_philhealth'],
        'b_sss' => $user['b_sss'],
        'b_pagibig' => $user['b_pagibig'],
        'b_tinnumber' => $user['b_tinnumber'],
        'emergency_contact_name' => $user['emergency_contact_name'],
        'emergency_contact_relationship' => $user['emergency_contact_relationship'],
        'emergency_contact_number' => $user['emergency_contact_number'],
        'remarks' => $user['remarks'],
        'notifications' => (int)$user['notifications'],
        'user_img' => $user['user_img'],
        'type' => $user['type'],
        'b_addedby' => (int)$user['b_addedby'],
        'b_dateadded' => $user['b_dateadded'],
        'employment_remarks' => $user['employment_remarks'],
        // Added by employee name
        'added_by_name' => $user['b_addedby'] ? 
          trim($user['added_by_first_name'] . ' ' . ($user['added_by_middle_name'] ? $user['added_by_middle_name'] . '. ' : '') . $user['added_by_last_name']) : 
          'System',
        // Joined data
        'position_name' => $user['position_name'],
        'department_name' => $user['department_name'],
        'sub_department_name' => $user['sub_department_name'],
        'employment_status_name' => $user['emp_stat_name']
      ]
    ]
  ]);
} catch (Throwable $e) {
  error_log('Login error: ' . $e->getMessage());
  error_log('Login error trace: ' . $e->getTraceAsString());
  json_response(['ok' => false, 'error' => 'SERVER_ERROR', 'details' => $e->getMessage()], 500);
}
