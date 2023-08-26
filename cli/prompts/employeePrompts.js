const inquirer = require('inquirer');
const dbQueries = require('../../db/queries');

// VIEW ALL EMPLOYEES
async function viewAllEmployees(main) {
    const employees = await dbQueries.getAllEmployees();
    console.table(employees);

    main();
}

// VIEW EMPLOYEE BY MANAGER
async function viewEmployeesByManager(main) {
    // 1. Fetch and display all managers in a table format
    const managers = await dbQueries.getAllManagers();
    console.table(managers);

    console.log("You are viewing the list of current managers");

    const managerChoices = managers.map(manager => ({ name: manager.manager_name, value: manager.id }));

    // 2. Prompt user to select a manager
    const managerAnswer = await inquirer.prompt([
        {
            type: 'list',
            name: 'managerId',
            message: 'Select a manager from the above list to view their employees:',
            choices: managerChoices,
        }
    ]);

    // 3. Fetch and display the manager's employees in a table format
    const employeesOfManager = await dbQueries.getEmployeesByManager(managerAnswer.managerId);
    console.table(employeesOfManager);

    const selectedManagerName = managerChoices.find(choice => choice.value === managerAnswer.managerId).name;
    console.log(`You are currently viewing the employees ${selectedManagerName} manages.`);

    // 4. Ask if user wants to view another manager's employees
    const anotherManagerAnswer = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'viewAnotherManager',
            message: 'Would you like to view another manager\'s employees?'
        }
    ]);

    if (anotherManagerAnswer.viewAnotherManager) {
        viewEmployeesByManager(main);
    } else {
        main();
    }
}

async function viewEmployeesByDepartment(main) {
    const departments = await dbQueries.getAllDepartments();
    console.table(departments);
    const departmentChoices = departments.map(dept => ({ name: dept.name, value: dept.id }));

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'departmentId',
            message: 'Select a department to view its employees:',
            choices: departmentChoices,
        }
    ]);

    const employeesInDepartment = await dbQueries.getEmployeesByDepartment(answers.departmentId);

    // Check if there are employees in the selected department
    if (employeesInDepartment.length === 0) {
        console.log("There are no employees in this department.");
    } else {
        console.table(employeesInDepartment);
    }

    // Prompt user if they want to view employees of another department
    const anotherDeptAnswer = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'viewAnotherDepartment',
            message: 'Would you like to view employees of another department?'
        }
    ]);

    if (anotherDeptAnswer.viewAnotherDepartment) {
        viewEmployeesByDepartment(main);
    } else {
        main();
    }
}

// ADD AN EMPLOYEE
async function addEmployeePrompt(main) {
    try {
        const departments = await dbQueries.getAllDepartments();
        const departmentChoices = departments.map(dept => ({ name: dept.name, value: dept.id }));
        const managers = await dbQueries.getSimpleManagersList();

        const managerChoices = managers.map(manager => ({ name: `${manager.first_name} ${manager.last_name}`, value: manager.id }));

        managerChoices.push({ name: 'None', value: null });

        const nameAnswers = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'Enter the employee\'s first name:',
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'Enter the employee\'s last name:',
            }
        ]);

        console.table(departments);
        const departmentAndManagerAnswers = await inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Select the employee\'s department:',
                choices: departmentChoices,
            },
            {
                type: 'confirm',
                name: 'isManager',
                message: 'Is this employee a manager?',
            },
            {
                type: 'list',
                name: 'managerId',
                message: 'Select the employee\'s manager:',
                choices: managerChoices,
                when: (departmentAndManagerAnswers) => !departmentAndManagerAnswers.isManager,
            },
        ]);

        const rolesForDepartment = await dbQueries.getRolesByDepartmentId(departmentAndManagerAnswers.department);
        const roleChoicesForDepartment = rolesForDepartment.map(role => ({ name: role.title, value: role.id }));

        console.table(rolesForDepartment);

        const roleAnswers = await inquirer.prompt([
            {
                type: 'list',
                name: 'roleId',
                message: 'Select the employee\'s role:',
                choices: roleChoicesForDepartment,
            }
        ]);

        const selectedRole = rolesForDepartment.find(role => role.id === roleAnswers.roleId);

        const salaryDecision = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'useDefaultSalary',
                message: `The typical salary for ${selectedRole.title} is ${selectedRole.salary}. Would you like to keep it?`
            }
        ]);

        const customSalary = salaryDecision.useDefaultSalary ? null : await inquirer.prompt([
            {
                type: 'input',
                name: 'customSalary',
                message: 'Enter the custom salary for the employee:',
                validate: input => {
                    const valid = !isNaN(parseFloat(input)) && isFinite(input);
                    return valid || 'Please enter a valid number.';
                },
                filter: Number
            }
        ]).then(answers => answers.customSalary);

        const newEmployee = {
            first_name: nameAnswers.firstName,
            last_name: nameAnswers.lastName,
            role_id: roleAnswers.roleId,
            manager_id: departmentAndManagerAnswers.isManager ? null : roleAnswers.managerId,
            custom_salary: customSalary,
            is_manager: departmentAndManagerAnswers.isManager ? 1 : 0
        };

        await dbQueries.addEmployee(newEmployee);

        const employees = await dbQueries.getAllEmployees();
        console.table(employees);
        console.log('Added new employee:', nameAnswers.firstName, nameAnswers.lastName);

        const continueAnswer = await inquirer.prompt({
            type: 'confirm',
            name: 'continueAdding',
            message: 'Would you like to add another employee?',
        });

        if (continueAnswer.continueAdding) {
            await addEmployeePrompt(main);
        } else {
            main();
        }
    } catch (error) {
        console.error("Error during addEmployeePrompt:", error);
    }
}

// UPDATE AN EMPLOYEES MANAGER
async function updateEmployeeManager(main) {
    const employees = await dbQueries.getAllEmployees();
    const managers = await dbQueries.getSimpleManagersList();

    const employeeChoices = employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Select an employee to update their manager:',
            choices: employeeChoices,
        }
    ]);

    const managerChoices = managers.map(manager => ({ name: `${manager.first_name} ${manager.last_name}`, value: manager.id }));
    managerChoices.push({ name: 'None', value: null });

    const managerAnswers = await inquirer.prompt([
        {
            type: 'list',
            name: 'newManagerId',
            message: 'Select the new manager for this employee:',
            choices: managerChoices,
        }
    ]);

    await dbQueries.updateEmployeeManager(answers.employeeId, managerAnswers.newManagerId);

    const employee = employees.find(e => e.id === answers.employeeId);
    const newManager = managerAnswers.newManagerId
        ? employees.find(e => e.id === managerAnswers.newManagerId)
        : null;

    if (newManager) {
        console.log(`${newManager.first_name} ${newManager.last_name} is now the new manager for ${employee.first_name} ${employee.last_name}.`);
    } else {
        console.log(`${employee.first_name} ${employee.last_name} no longer has a manager.`);
    }

    // Return to main
    main();
}

// REMOVE AN EMPLOYEE
async function deleteEmployeePrompt(main) {
    const employees = await dbQueries.getAllEmployees();

    const employeeChoices = employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
    }));

    const deletePrompt = {
        type: 'list',
        name: 'employeeToDelete',
        message: 'Select an employee to remove:',
        choices: employeeChoices,
    };

    const answers = await inquirer.prompt(deletePrompt);

    // Check if the employee to be deleted is a manager
    const isManager = employees.some(employee => employee.manager_id === answers.employeeToDelete);

    if (isManager) {
        console.log(`${employeeToDeleteName} is a manager, please reassign their managed employees before removing.`);
        main();
        return;
    }

    const employeeToDeleteName = employeeChoices.find(choice => choice.value === answers.employeeToDelete).name;

    await dbQueries.deleteEmployee(answers.employeeToDelete);

    const updatedEmployees = await dbQueries.getAllEmployees();
    console.table(updatedEmployees);

    console.log(`${employeeToDeleteName} has been removed`);

    const continueDeletePrompt = {
        type: 'confirm',
        name: 'continueDeleting',
        message: 'Would you like to delete another employee?',
    };
    const continueDeleteAnswer = await inquirer.prompt(continueDeletePrompt);

    if (continueDeleteAnswer.continueDeleting) {
        await deleteEmployeePrompt(main);
    } else {
        main();
    }
}

module.exports = {
    handleEmployeePrompts: async (main) => {
        const employeeAction = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeAction',
                message: 'What would you like to do with employees?',
                choices: [
                    'View all employees',
                    'View employees by manager',
                    'View employees by department',
                    'Add an employee',
                    'Update an employees manager',
                    'Remove an employee',
                ],
            },
        ]);

        const selectedEmployeeAction = employeeAction.employeeAction;
        if (selectedEmployeeAction === 'View all employees') {
            await viewAllEmployees(main);
        } else if (selectedEmployeeAction === 'View employees by manager') {
            await viewEmployeesByManager(main);
        } else if (selectedEmployeeAction === 'View employees by department') {
            await viewEmployeesByDepartment(main);
        } else if (selectedEmployeeAction === 'Add an employee') {
            await addEmployeePrompt(main);
        } else if (selectedEmployeeAction === 'Update an employees manager') {
            await updateEmployeeManager(main);
        } else if (selectedEmployeeAction === 'Remove an employee') {
            await deleteEmployeePrompt(main);
        }
    },
};