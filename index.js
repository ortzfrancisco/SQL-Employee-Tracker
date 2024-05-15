const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "Elpueblito1",
        database: "employee_tracker_db",
    },
    console.log(`Connected to employee_tracker_db database.`)
);

//initializes program
function init() {
    const operationChoices = [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Quit",
    ];
    //prompts user for inital operation
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "operation",
                choices: operationChoices,
            },
        ])
        .then((response) => {
            // switch statement directs user's response to corresponding function
            switch (response.operation) {
                case "View All Employees":
                    displayTable("employees");
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "View All Roles":
                    displayTable("roles");
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "View All Departments":
                    displayTable("departments");
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                default:
                    console.log(`Goodbye.`);
                    process.exit();
            }
        });
}

// adds employee to database
function addEmployee() {
    //pulling current roles from database to use in inquirer prompt list
    let currentRoles = [];
    db.query("SELECT * FROM roles", function (err, results) {
        if (err) {
            console.error(err);
        } else {
            results.forEach((result) => {
                currentRoles.push(result.job_title);
            });
        }
    });
    // pulling current employees to use in inquirer prompt list
    let employeesArray = [{ name: "none", id: null }];
    db.query("SELECT * FROM employees", function (err, results) {
        if (err) {
            console.error(err);
        } else {
            results.forEach((result) => {
                let fullName = `${result.first_name} ${result.last_name}`;
                employeesArray.push({ name: fullName, id: result.id });
            });
        }
    });

    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the employee's first name?",
                name: "firstName",
                validate: function (input) {
                    if (input) {
                        return true;
                    } else {
                        return "Please enter the employee's first name.";
                    }
                }
            },
            {
                type: "input",
                message: "What is the employee's last name?",
                name: "lastName",
                validate: function (input) {
                    if (input) {
                        return true;
                    } else {
                        return "Please enter the employee's last name.";
                    }
                }
            },
            {
                type: "list",
                message: "What is the employee's role",
                name: "role",
                choices: currentRoles,
            },
            {
                type: "list",
                message: "Who is the employee's manager?",
                name: "manager",
                choices: employeesArray,
            },
        ])
        .then((newEmployee) => {
            //pulling all roles from database
            db.query("SELECT * FROM roles", function (err, results) {
                0;
                results.forEach((result) => { //iterating through database roles and comparing job title to the new employee role to get role_id
                    if (result.job_title === newEmployee.role) {
                        employeesArray.forEach((employee) => {//iterating through employees 
                            if (employee.name === newEmployee.manager) {//comparing if the name matches the new employee's manager
                                let newEmployeeManagerId = employee.id;
                                const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)VALUES (?,?,?,?)`; //need to add manager_id and role_id
                                const params = [
                                    newEmployee.firstName,
                                    newEmployee.lastName,
                                    result.id,
                                    newEmployeeManagerId,
                                ];
                                //inserting the new employee data into the employee database
                                db.query(sql, params, function (err, results) {
                                    if (err) {
                                        console.error(err);
                                    } else {
                                        console.log(
                                            `Added ${newEmployee.firstName} ${newEmployee.lastName} to the database\n`
                                        );
                                        init();
                                    }
                                });
                            }
                        });
                    }
                });
            });
        });
}

//adding department to departments_db
function addDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the department?",
                name: "deptName",
                validate: function (input) {
                    if (input) {
                        return true;
                    } else {
                        return "Please enter a department name.";
                    }
                }
            },
        ])
        .then((newDepartment) => {
            const sql = `INSERT INTO departments (department_name)
      VALUES (?)`;
            const params = [newDepartment.deptName];
            db.query(sql, params, function (err, results) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Added ${newDepartment.deptName} to the database.\n`);
                    init();
                }
            });
        });
}

// adding role to roles_db
function addRole() {
    //creating array to contain all the departments for use in the inquirer prompt
    let currentDept = [];
    db.query("SELECT * FROM departments", function (err, results) {
        if (err) {
            console.error(err);
        } else {
            results.forEach((result) => {
                currentDept.push(result.department_name);
            });
        }
    });
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the role?",
                name: "roleName",
                validate: function (input) {
                    if (input) {
                        return true;
                    } else {
                        return "Please provide a role name.";
                    }
                },
            },
            {
                type: "input",
                message: "What is the salary of the role?",
                name: "roleSalary",
                validate: function (input) {
                    // convert prompt to int
                    const value = parseInt(input);
                    //check if input is a int or NaN
                    if (input && !isNaN(value) && Number.isInteger(value)) {
                        return true;
                    } else {
                        //User doesn't input a number value
                        return "Please provide a salary for the role.";
                    }
                },
            },
            {
                type: "list",
                message: "What department does the role belong to?",
                name: "roleDept",
                choices: currentDept,
            },
        ])
        .then((newRole) => {
            db.query("SELECT * FROM departments", function (err, results) {
                results.forEach((result) => {
                    // compare the selected name to name in database in order to pull dept_id
                    if (result.department_name === newRole.roleDept) {
                        const sql = `INSERT INTO roles (job_title, salary, department_id)
      VALUES (?,?,?)`;
                        const params = [newRole.roleName, newRole.roleSalary, result.id];

                        // Create new job row in roles table
                        db.query(sql, params, function (err, results) {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log(`Added ${newRole.roleName} to the database.\n`);
                                init();
                            }
                        });
                    }
                });
            });
        });
}

// update employee's role information in the employee_db
function updateEmployeeRole() {
    let rolesArray = [];
    let employeesArray = [];

    db.query("SELECT * FROM roles", function (err, roles) {
        if (err) {
            console.error(err);
        } else {
            roles.forEach((role) => {
                rolesArray.push({ name: role.job_title, value: role.id });
            });

            db.query("SELECT * FROM employees", function (err, employees) {
                if (err) {
                    console.error(err);
                } else {
                    employees.forEach((employee) => {
                        let fullName = `${employee.first_name} ${employee.last_name}`;
                        employeesArray.push({ name: fullName, value: employee.id });
                    });

                    inquirer
                        .prompt([
                            {
                                type: "list",
                                message: "Which employee's role do you want to update?",
                                name: "employee",
                                choices: employeesArray,
                            },
                            {
                                type: "list",
                                message:
                                    "Which role do you want to assign the selected employee?",
                                name: "role",
                                choices: rolesArray,
                            },
                        ])
                        .then((response) => {
                            const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
                            const params = [response.role, response.employee];
                            db.query(
                                `UPDATE employees SET role_id = ? WHERE id = ?`,
                                params,
                                function (err, results) {
                                    if (err) {
                                        console.error(err);
                                    } else {
                                        console.log(`Updated employee's role in the database.\n`);
                                        init();
                                    }
                                }
                            );
                        });
                }
            });
        }
    });
}

//display tables for each database, choice is passed through via the init() switch statement
function displayTable(choice) {
    switch (choice) {
        case "employees":
            db.query(
                "SELECT e1.id, e1.first_name, e1.last_name, r.job_title title, d.department_name department, r.salary, CONCAT(e2.first_name, ' ', e2.last_name) AS manager FROM employees e1 INNER JOIN roles r ON e1.role_ID = r.id INNER JOIN departments d ON r.department_id = d.id LEFT JOIN employees e2 ON e1.manager_id = e2.id",
                function (err, results) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.table(results);
                        init();
                    }
                }
            );
            break;

        case "roles":
            db.query(
                "SELECT r.id, r.job_title, d.department_name, r.salary FROM departments d JOIN roles r ON d.id = r.department_id",
                function (err, results) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.table(results);
                        init();
                    }
                }
            );
            break;

        default:
            db.query(
                `SELECT d.id, d.department_name FROM departments d`,
                function (err, results) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.table(results);
                        init();
                    }
                }
            );
            break;
    }
}

// initialize program

init();