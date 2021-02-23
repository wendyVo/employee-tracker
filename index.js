const mysql = require('mysql');
const inquirer = require('inquirer');

//Create connection to MySQL Database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'wendyUyen',
    database: 'employees_db',
});

connection.connect((err) => {
    if (err) throw err;
    console.log("\n WELCOME TO EMPLOYEE TRACKER \n");
    mainPrompt();
});

//Main menu for all the questions about employees tracker
const mainPrompt = () => {
    inquirer.prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all employees',
                'View all employees by Department',
                'View all employees by Manager',
                'Add an Employee',
                'Add a Department',
                'Add a Role',
                'Update employee roles',
                'Update employee managers',
                'Delete an Employee',
                'Delete a Department',
                'Delete a Role',
                'View total budget of a department',
                'Exit',
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case 'View all employees':
                    viewAllEmployees();
                    break;

                case 'View all employees by Department':
                    viewEmpByDept();
                    break;

                case 'View all employees by Manager':
                    viewEmpByMnager();
                    break;

                case 'Add an Employee':
                    addEmployee();
                    break;

                case 'Add a Department':
                    addDepartment();
                    break;

                case 'Add a Role':
                    addRole();
                    break;

                case 'Update employee roles':
                    updateEmpRole();
                    break;

                case 'Update employee managers':
                    updateEmpMnger();
                    break;

                case 'Delete an Employee':
                    deleteEmp();
                    break;

                case 'Delete a Department':
                    deleteDept();
                    break;

                case 'Delete a Role':
                    deleteRole();
                    break;

                case 'View total budget of a department':
                    viewBudget();
                    break;

                case 'Exit':
                    connection.end();
                    break;

                default:
                    console.log(`Invalid action: ${answer.action}`);
                    break;
            }
        });
};

//View all employees
const viewAllEmployees = () => {
    const query =
        `SELECT e.id AS employee_id, e.first_name, e.last_name, d.name AS departmentName, r.title AS jobTitle, r.salary, 
    CONCAT(m.first_name, " ", m.last_name) AS managerName 
    FROM employee e 
    LEFT JOIN role r
    ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
    ON e.manager_id = m.id;
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        mainPrompt();
    });
};

//View all employees by Department
const viewEmpByDept = () => {
    const query = `SELECT * FROM department`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        const deptChoices = res.map(({ id, name }) => ({
            value: id,
            name: name,
        }))

        inquirer.prompt({
                name: 'viewbyDept',
                type: 'list',
                message: 'Which department would you like to view',
                choices: deptChoices,
            })
            .then((answer) => {
                const query =
                    ` SELECT e.id AS employee_id, e.first_name, e.last_name, d.name AS departmentName, r.title AS jobTitle, r.salary, CONCAT(m.first_name, " ", m.last_name) AS managerName
        FROM employee e
        LEFT JOIN employee m
        ON e.manager_id = m.id
        INNER JOIN role r
        ON e.role_id = r.id
        INNER JOIN department d
        ON d.id = r.department_id
       
        WHERE d.id = ?;`;
                connection.query(query, (answer.viewbyDept), (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    mainPrompt();
                });
            });
    });
};

//View all employee by Manager
const managerArray = [];
const viewEmpByMnager = () => {
    const query = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY manager;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        const MngerChoices = res.map(({ id, manager }) => ({
            value: id,
            name: manager,
        }))

        inquirer.prompt({
                name: 'viewbyMnger',
                type: 'list',
                message: 'Which manager would you like to view under',
                choices: MngerChoices,
            })
            .then((answer) => {
                const query =
                    ` SELECT e.id AS employee_id, e.first_name, e.last_name, d.name AS departmentName, r.title AS jobTitle, r.salary, CONCAT(m.first_name, " ", m.last_name) AS managerName
        FROM employee e
        LEFT JOIN role r
        ON e.role_id = r.id
        LEFT JOIN department d
        ON d.id = r.department_id
        LEFT JOIN employee m
        ON e.manager_id = m.id
        WHERE e.manager_id = ?;`;
                connection.query(query, (answer.viewbyMnger), (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    mainPrompt();
                });
            });
    });
};

function buildManagerArray() {
    const query = `
    SELECT DISTINCT x.id, CONCAT(x.first_name, " ", x.last_name) 
    AS manager_name 
    FROM employee e 
    INNER JOIN employee x 
    ON e.manager_id = x.id`;

    connection.query(query, function(err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            managerArray.push(res[i].manager_name);
        }
        managerArray.push('null'); //Adds Null At the end of the array since not all new employees have managers
    });
}
//Add an Employee
const addEmployee = () => {
    connection.query("SELECT CONCAT(e.first_name, ' ', e.last_name) AS manager FROM employee e", function(err, res) {
        if (err) throw err;

        connection.query("SELECT title FROM role", function(err, res2) {
            if (err) throw err;

            const roleLists = res2.map((role) => role.title);
            const managerLists = res.map((employee) => employee.manager)
            managerChoices.push("null");

            // Prompt user for new employee information
            inquirer.prompt(
                [{
                        name: "first_name",
                        type: "input",
                        message: "Enter employee's first name: ",
                    },
                    {
                        name: "last_name",
                        type: "input",
                        message: "Enter employee's last name: ",
                    },
                    {
                        name: "role",
                        type: "list",
                        message: "Choose employee's role: ",
                        choices: roleLists.filter((item, index) => roleLists.indexOf(item) === index),
                    },
                    {
                        name: "manager",
                        type: "list",
                        message: "Who is employee's manager? ",
                        choices: managerLists,
                    }
                ],
            ).then(function(answer) {
                // Add new empoyee to database
                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, (SELECT id FROM role WHERE title = ?), (SELECT id FROM employee b WHERE CONCAT(b.first_name, ' ', b.last_name) = ?))`, [answe.first_name, answer.last_name, answer.role, answer.manager], function(err, result) {
                    if (err) throw err;

                    console.log("<-------------------------------------------------------------------->")
                    console.log(`${answer.first_name} ${answer.last_name} has been added successfully!! `)
                    console.log("<-------------------------------------------------------------------->")
                    mainPrompt();
                })
            })
        })
    });
};

//Add a Department
const addDepartment = () => {
    const query = `SELECT * FROM department`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        const deptChoices = res.map((department) => department.name)
        inquirer.prompt({
            name: "deptName",
            type: "input",
            message: "Enter Department Name: "
        }).then((answer) => {
            if (deptChoices.includes(answer.deptName)) {
                console.log("Department already exist");
                mainPrompt();
            } else {
                connection.query('INSERT INTO department SET ?', [{
                        name: answer.deptName
                    }],
                    (err) => {
                        if (err) throw err;
                        console.log("<-------------------------------------------------------------------->")
                        console.log(`New ${answer.deptName} department added successfully`);
                        console.log("<-------------------------------------------------------------------->")
                        mainPrompt();
                    })
            }
        })
    });
};

//Add a role
const addRole = () => {
    const query = `SELECT id, name FROM department`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        const currentDept = res.map(department => ({
            value: department.id,
            name: department.name
        }))
        inquirer.prompt([{
                name: "title",
                type: "input",
                message: "Enter title of new role: "
            },
            {
                name: "salary",
                type: "input",
                message: "Enter salary of new role: "
            },
            {
                name: "department_id",
                type: "list",
                message: "Department of new role:  ",
                choices: currentDept
            }
        ]).then((answer) => {
            const query = `INSERT INTO role (title, salary, department_id) 
            VALUES (?, ?, ?)`;
            connection.query(query, [
                    answer.title,
                    answer.salary,
                    answer.department_id,
                ],

                (err, res) => {
                    if (err) throw err;
                    console.log("<-------------------------------------------------------------------->")
                    console.log(`New ${answer.title} department added successfully`);
                    console.log("<-------------------------------------------------------------------->")
                    mainPrompt();
                })

        })
    });

};

//Update Employee roles
const updateEmpRole = () => {
    const query = `SELECT CONCAT (e.first_name, " " , e.last_name) AS employees, e.id, r.title
    FROM employee e
    LEFT JOIN role r
    ON r.id = e.role_id`
    connection.query(query, (err, res) => {
        if (err) throw err;
        const empChoices = res.map(employee => ({
            name: employee.employees,
            value: employee.id
        }));
        const roleChoices = res.map(role => ({
            name: role.title,
            value: role.id
        }));
        inquirer.prompt([{
                name: "employee",
                type: "list",
                message: "Which employee that you would like to update the role? ",
                choices: empChoices
            },
            {
                name: "roleUpdate",
                type: "list",
                message: "Which role would you like to update? ",
                choices: roleChoices.filter((item, index) => roleChoices.indexOf(item) === index)
            }
        ]).then((answer) => {
            const query = `UPDATE employee SET role_id = ? WHERE id = ?`;
            connection.query(query, [
                answer.role_id,
                answer.id
            ], (err, res) => {
                if (err) throw err;
                console.log("<-------------------------------------------------------------------->")
                console.log("      The employee role has been updated successfully!! ")
                console.log("<-------------------------------------------------------------------->")
                mainPrompt();
            })
        })
 
    });
}

//Delete Employee
const deleteEmp = () => {
    const query = `SELECT CONCAT(e.first_name, " " , e.last_name) AS employees, e.id
    FROM employee e`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        const empChoices = res.map(employee => ({
            name: employee.employees,
        }));
        inquirer.prompt({
                name: 'deleteEmp',
                type: 'list',
                message: 'Which employee would you like to remove?',
                choices: empChoices,
            })
            .then((answer) => {
                const query =
                    ` DELETE FROM employee e WHERE CONCAT(e.first_name, ' ', e.last_name) = ?`;
                connection.query(query, (answer.deleteEmp), (err, res) => {
                    if (err) throw err;
                    console.log("<-------------------------------------------------------------------->");
                    console.log("        The employee has been deleted successfully! ");
                    console.log("<-------------------------------------------------------------------->");
                    mainPrompt();
                });
            });
    });
}

//Delete a Department
const deleteDept = () => {
    const query = `SELECT * FROM department`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        const deptChoices = res.map(({ id, name }) => ({
            value: id,
            name: name,
        }))
        inquirer.prompt({
                name: 'deleteDept',
                type: 'list',
                message: 'Which department would you like to remove?',
                choices: deptChoices,
            })
            .then((answer) => {
                const query =
                    ` DELETE FROM department d WHERE d.id = ?`;
                connection.query(query, (answer.deleteDept), (err, res) => {
                    if (err) throw err;
                    console.log(" ");
                    console.log("The department has been deleted successfully! ");
                    console.log(" ");
                    mainPrompt();
                });
            });
    });
};

//Delete a Role
const deleteRole = () => {
    const query = `SELECT id, title, salary FROM role`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        const existingRoles = res.map(role => ({
            name: role.title,
        }));
        inquirer.prompt({
                name: 'deleteRole',
                type: 'list',
                message: 'Which role would you like to remove?',
                choices: existingRoles,
            })
            .then((answer) => {
                const query =
                    ` DELETE FROM role r WHERE r.title = ?`;
                connection.query(query, (answer.deleteRole), (err, res) => {
                    if (err) throw err;
                    console.log(" ");
                    console.log("The role has been deleted successfully! ");
                    console.log(" ");
                    mainPrompt();
                });
            });
    });
};