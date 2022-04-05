DROP DATABASE IF EXISTS employee_trackerapp_db;
CREATE DATABASE IF NOT EXISTS employee_trackerapp_db;

USE employee_trackerapp_db;

CREATE TABLE departments (
    dept_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_cat VARCHAR(20) NOT NULL
);

CREATE TABLE roles (
    role_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(20) NOT NULL,
    salary INT NOT NULL,
    dept_id INT NOT NULL
);

CREATE TABLE employees (
    emp_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    dept_id INT NOT NULL,
    current_salary INT NOT NULL,
    direct_manager VARCHAR(20)
);