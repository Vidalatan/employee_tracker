UPDATE employees
SET role_id = '$<ROLE_ID>', direct_manager_name = '$<MANAGERNAME>'
WHERE emp_id = '$<EMP_ID>';