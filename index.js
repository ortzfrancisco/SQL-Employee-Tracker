const mysql = require('mysql2');
const inquirer = require('inquirer');
const db = require('./db/connection.js') // Ensure this is correctly referring to your connection module


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Elpueblito1',
    database: 'employee_tracker_db'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Database connected.');
    promptUser();
});

function promptUser() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
                'Exit'
            ]
        }
    ]).then(answer => {
        switch (answer.action) {
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    });
}

function viewAllDepartments() {
    const query = 'SELECT * FROM department';
    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        promptUser();
    });
}

function viewAllRoles() {
    const query = 'SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id';
    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        promptUser();
    });
}

function viewAllEmployees() {
    const query = `
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
        FROM employee 
        LEFT JOIN role ON employee.role_id = role.id 
        LEFT JOIN department ON role.department_id = department.id 
        LEFT JOIN employee manager ON manager.id = employee.manager_id`;
    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        promptUser();
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:'
        }
    ]).then(answer => {
        const query = 'INSERT INTO department SET ?';
        connection.query(query, { name: answer.name }, (err, results) => {
            if (err) throw err;
            console.log(`Added ${answer.name} to the database`);
            promptUser();
        });
    });
}

function addRole() {
    connection.query('SELECT * FROM department', (err, departments) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the name of the role:'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary for the role:'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Select the department for the role:',
                choices: departments.map(department => ({
                    name: department.name,
                    value: department.id
                }))
            }
        ]).then(answers => {
            const query = 'INSERT INTO role SET ?';
            connection.query(query, answers, (err, results) => {
                if (err) throw err;
                console.log(`Added ${answers.title} to the database`);
                promptUser();
            });
        });
    });
}

function addEmployee() {
    connection.query('SELECT * FROM role', (err, roles) => {
        if (err) throw err;
        connection.query('SELECT * FROM employee', (err, employees) => {
            if (err) throw err;
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'Enter the first name of the employee:'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'Enter the last name of the employee:'
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select the role for the employee:',
                    choices: roles.map(role => ({
                        name: role.title,
                        value: role.id
                    }))
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Select the manager for the employee (or None):',
                    choices: [
                        { name: 'None', value: null },
                        ...employees.map(employee => ({
                            name: `${employee.first_name} ${employee.last_name}`,
                            value: employee.id
                        }))
                    ]
                }
            ]).then(answers => {
                const query = 'INSERT INTO employee SET ?';
                connection.query(query, answers, (err, results) => {
                    if (err) throw err;
                    console.log(`Added ${answers.first_name} ${answers.last_name} to the database`);
                    promptUser();
                });
            });
        });
    });
}

function updateEmployeeRole() {
    connection.query('SELECT * FROM employee', (err, employees) => {
        if (err) throw err;
        connection.query('SELECT * FROM role', (err, roles) => {
            if (err) throw err;
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee_id',
                    message: 'Select the employee to update:',
                    choices: employees.map(employee => ({
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.id
                    }))
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select the new role for the employee:',
                    choices: roles.map(role => ({
                        name: role.title,
                        value: role.id
                    }))
                }
            ]).then(answers => {
                const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
                connection.query(query, [answers.role_id, answers.employee_id], (err, results) => {
                    if (err) throw err;
                    console.log('Updated employee\'s role');
                    promptUser();
                });
            });
        });
    });
}
