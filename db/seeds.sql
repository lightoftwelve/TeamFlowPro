-- Sample Data
INSERT INTO departments (id, name) VALUES
(1, 'Engineering'),
(2, 'Sales'),
(3, 'Marketing');

INSERT INTO roles (id, title, salary, department_id) VALUES
(1, 'Software Engineer', 80000, 1),
(2, 'Sales Representative', 50000, 2),
(3, 'Marketing Specialist', 55000, 3);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id) VALUES
(1, 'John', 'Doe', 1, NULL),
(2, 'Jane', 'Smith', 2, NULL),
(3, 'Michael', 'Johnson', 3, 1);