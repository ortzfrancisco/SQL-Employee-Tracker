INSERT INTO departments (department_name)
VALUES ("Sales"),
    ("Customer Service"),
    ("Finance"),
    ("Administration"),
    ("Human Resources"),
    ("Warehouse");

INSERT INTO roles (department_id, job_title, salary)
VALUES (1, "Salesperson", 85000),
    (2, "Receptionist", 80000),
    (2, "Customer Service Specialist", 80000),
    (3, "Head of Accounting", 260000),
    (3, "Accountant", 250000),
    (4, "Manager", 275000),
    (4, "Assistant to the Regional Manager", 175000),
    (5, "HR Representative", 160000),
    (6, "Warehouse Foreman", 90000);

INSERT INTO employees (first_name, last_name, manager_id, role_id)
VALUES ("Michael", "Scott", NULL, 6),
    ("Jim", "Halpert", 1, 1),
    ("Dwight", "Schrute", 1, 1),
    ("Pam", "Beesly", 1, 2),
    ("Angela", "Martin", 1, 4),
    ("Kelly", "Kapoor", 1, 3),
    ("Andy", "Bernard", 1, 1),
    ("Toby", "Flenderson", NULL, 8),
    ("Kevin", "Malone", 5, 5),
    ("Stanley", "Hudson", 1, 1),
    ("Oscar", "Martinez", 5, 5),
    ("Daryll", "Philbin", NULL, 9);


SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employees;