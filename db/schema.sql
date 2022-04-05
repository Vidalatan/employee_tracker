-- Reset Database
DROP DATABASE IF EXISTS employee_trackerapp_db;
CREATE DATABASE IF NOT EXISTS employee_trackerapp_db;

USE employee_trackerapp_db;

-- Create departments table
CREATE TABLE departments (
    dept_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(20) NOT NULL
);

-- Create roles table
CREATE TABLE roles (
    role_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary INT NOT NULL,
    dept_id INT NOT NULL,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- Create employees table
CREATE TABLE employees (
    emp_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    direct_manager_name VARCHAR(60),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);