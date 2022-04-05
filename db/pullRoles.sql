SELECT roles.title, roles.salary, departments.department_name
FROM roles
INNER JOIN departments ON roles.dept_id=departments.dept_id