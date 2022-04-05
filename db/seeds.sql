USE employee_trackerapp_db;

-- Insert some preset departments. 
INSERT INTO departments (department_name)
VALUES ('Retail'),('Security'),('Online Sales'),('Engineering'),('Sanitation');

-- Insert some preset roles, Department ids are:
-- Retail: 1, Security: 2, Online Sales: 3, Engineering: 4, Janitorial: 5
INSERT INTO roles (title, salary, dept_id)
VALUES
('Head of Retail', 70000, 1),
('Retail Manager', 50000, 1),
('Retail Supervisor', 35000, 1),
('Retail Associate', 20000, 1),
('Head of Security', 75000, 2),
('Security Manager', 60000, 2),
('Security Supervisor', 45000, 2),
('Security Guard', 30000, 2),
('Head of Online Sales', 70000, 3),
('Online Sales Specialist', 55000, 3),
('Head of Engineering', 145000, 4),
('Project Manager', 125000, 4),
('Engineer', 105000, 4),
('Head of Sanitation', 65000, 5),
('Sanitation Manager', 45000, 5),
('Sanitation Specialist', 30000, 5);

-- Insert some preset employees
INSERT INTO employees (first_name, last_name, role_id, direct_manager_name)
VALUES
('Gregory', 'Thomas', 1, NULL),
('David', 'White', 2, 'Gregory Thomas'),
('Emily', 'Franco', 3, 'David White'),
('Joan', 'House', 4, 'Emily Franco'),
('Sheryl', 'Blanco', 4, 'Emily Franco'),
('Alejandro', 'Salazer', 4, 'Emily Franco');