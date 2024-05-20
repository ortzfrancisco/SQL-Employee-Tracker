INSERT INTO departments (name) VALUES 
    ('Sales'), 
    ('Customer Service'), 
    ('Finance'), 
    ('Administration'), 
    ('Human Resources'), 
    ('Warehouse');

INSERT INTO roles (title, salary, department_id) VALUES 
    ('Salesperson', 85000, 1),
    ('Receptionist', 80000, 2),
    ('Customer Service Specialist', 80000, 2),
    ('Head of Accounting', 260000, 3),
    ('Accountant', 250000, 3),
    ('Manager', 275000, 4),
    ('Assistant to the Regional Manager', 175000, 4),
    ('HR Representative', 160000, 5),
    ('Warehouse Foreman', 90000, 6);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES 
    ('Michael', 'Scott', 6, NULL),
    ('Jim', 'Halpert', 1, 1),
    ('Dwight', 'Schrute', 1, 1),
    ('Pam', 'Beesly', 2, 1),
    ('Angela', 'Martin', 4, 1),
    ('Kelly', 'Kapoor', 3, 1),
    ('Andy', 'Bernard', 1, 1),
    ('Toby', 'Flenderson', 8, NULL),
    ('Kevin', 'Malone', 5, 5),
    ('Stanley', 'Hudson', 1, 1),
    ('Oscar', 'Martinez', 5, 5),
    ('Daryll', 'Philbin', 9, NULL);

SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employee;
