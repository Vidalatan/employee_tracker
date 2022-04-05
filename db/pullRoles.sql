SELECT roles.title, roles.role_id, departments.department_name, roles.salary
FROM roles
INNER JOIN departments ON roles.dept_id=departments.dept_id