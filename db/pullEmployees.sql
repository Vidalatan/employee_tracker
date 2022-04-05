SELECT departments.department_name, roles.title, roles.salary, employees.first_name, employees.last_name, IFNULL(direct_manager_name, 'No Manager') as direct_manager_name
FROM employees
INNER JOIN roles ON employees.role_id=roles.role_id
INNER JOIN departments ON departments.dept_id=roles.dept_id;