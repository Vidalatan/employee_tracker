DROP DATABASE IF EXISTS employee_trackerapp_db;
CREATE DATABASE IF NOT EXISTS employee_trackerapp_db;

USE employee_trackerapp_db;

CREATE TABLE departments (
    dept_id INT NOT NULL AUTO_INCREMENt,
    department_cat VARCHAR(20) NOT NULL,
    PRIMARY KEY (dept_id)
);

CREATE TABLE roles (
    role_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(20) NOT NULL,
    salary INT NOT NULL,
    dept_id INT NOT NULL,
    PRIMARY KEY (role_id),
    FOREIGN KEY (dept_id) REFRENCES departments(dept_id)
);

CREATE TABLE employees (
    emp_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    dept_id INT NOT NULL,
    current_salary INT NOT NULL,
    direct_manager VARCHAR(20)
    PRIMARY KEY (emp_id),
    FOREIGN KEY (dept_id) REFRENCES departments(dept_id),
    FOREIGN KEY (role_id) REFRENCES roles(role_id)
);