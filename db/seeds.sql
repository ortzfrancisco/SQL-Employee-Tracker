INSERT INTO department (id, name) VALUES 
    (1,'Sales'), 
    (2,'Customer Service'), 
    (3,'Finance'), 
    (4,'Administration'), 
    (5,'Human Resources'), 
    (6,'Warehouse');

INSERT INTO roles (id, title, salary, department_id) VALUES 
    (1,'Salesperson', 85000, 1),
    (2,'Receptionist', 80000, 2),
    (3,'Customer Service Specialist', 80000, 2),
    (4,'Head of Accounting', 260000, 3),
    (5,'Accountant', 250000, 3),
    (6,'Manager', 275000, 4),
    (7,'Assistant to the Regional Manager', 175000, 4),
    (8,'HR Representative', 160000, 5),
    (9,'Warehouse Foreman', 90000, 6);

INSERT INTO employee (id, first_name, last_name, roles_id, manager_id) VALUES 
    (1,'Michael', 'Scott', 6, NULL),
    (2,'Jim', 'Halpert', 1, 1),
    (3,'Dwight', 'Schrute', 1, 1),
    (4,'Pam', 'Beesly', 2, 1),
    (5,'Angela', 'Martin', 4, 1),
    (6,'Kelly', 'Kapoor', 3, 1),
    (7,'Andy', 'Bernard', 1, 1),
    (8,'Toby', 'Flenderson', 8, NULL),
    (9,'Kevin', 'Malone', 5, 5),
    (10,'Stanley', 'Hudson', 1, 1),
    (11,'Oscar', 'Martinez', 5, 5),
    (12,'Daryll', 'Philbin', 9, NULL);

-- SELECT * FROM departments;
-- SELECT * FROM roles;
-- SELECT * FROM employees;
