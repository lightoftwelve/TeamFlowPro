const inquirer = require('inquirer');
const dbQueries = require('../../db/queries');

// VIEW ALL ROLES
async function viewAllRoles(main) {
    const roles = await dbQueries.getAllRoles();
    console.table(roles);

    main();
}

// VIEW ROLES BY DEPARTMENT
async function viewRolesByDepartmentPrompt(main) {
    // Fetch all departments
    const departments = await dbQueries.getAllDepartments();
    const departmentChoices = departments.map(dept => ({ name: dept.name, value: dept.id }));

    while (true) {
        // Displays the departments with their counts for better decision making
        console.log("\nDepartments Overview:");
        console.table(departments);

        // Prompt user to select a department
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'departmentId',
                message: 'Select a department to view its roles:',
                choices: departmentChoices,
            }
        ]);

        // Fetch roles for the selected department
        const roles = await dbQueries.getRolesByDepartmentId(answers.departmentId);

        const selectedDepartment = departments.find(dept => dept.id === answers.departmentId);
        const departmentName = selectedDepartment ? selectedDepartment.name : 'Unknown';

        // If there are roles, display them
        if (roles.length > 0) {
            console.table(roles);
            console.log(`You are viewing the current roles available in the ${departmentName} department`);
        } else {
            console.log(`There are no roles available in the ${departmentName} department.`);
        }

        // Ask the user if they want to view roles from another department
        const nextAction = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'viewDepartmentRoles',
                message: 'Would you like to view roles from another department?',
                default: false
            }
        ]);

        if (!nextAction.viewDepartmentRoles) {
            return main();
        }
    }
}

// ADD A ROLE
async function addRolePrompt(main) {
    const departments = await dbQueries.getAllDepartments();
    const departmentChoices = departments.map(dept => ({ name: dept.name, value: dept.id }));

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the role title:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for this role:',
        },
        {
            type: 'list',
            name: 'departmentId',
            message: 'Select the department for this role:',
            choices: departmentChoices,
        }
    ]);

    await dbQueries.addRole(answers);

    // Display all roles in the department where the new role was added
    const roles = await dbQueries.getRolesByDepartmentId(answers.departmentId);
    console.table(roles);

    const selectedDepartment = departments.find(dept => dept.id === answers.departmentId);
    const departmentName = selectedDepartment ? selectedDepartment.name : 'Unknown';

    console.log(`Added new role: ${answers.title} to the ${departmentName} department`);

    // Check if main function is passed and is a function, then call it
    if (typeof main === 'function') {
        main();
    }

}

// DELETE A ROLE
async function deleteRolePrompt(main) {
    while (true) {
        const roles = await dbQueries.getAllRoles();

        // If there are no roles, inform the user and break out of the loop
        if (roles.length === 0) {
            console.log('There are no roles available to delete.');
            break;
        }

        const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'roleId',
                message: 'Select a role to delete:',
                choices: roleChoices,
            }
        ]);

        await dbQueries.deleteRole(answers.roleId);

        const deleteRoles = await dbQueries.getAllRoles();
        console.table(deleteRoles);
        console.log('Role deleted successfully.');

        // Ask the user if they want to delete another role
        const nextAction = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'deleteAnotherRole',
                message: 'Would you like to delete another role?',
                default: false
            }
        ]);

        // If they don't want to delete another role, break out of the loop
        if (!nextAction.deleteAnotherRole) {
            break;
        }
    }

    main();
}

async function updateEmployeeRole(main) {
    while (true) {
        const employees = await dbQueries.getAllEmployees();
        const roles = await dbQueries.getAllRoles();

        const employeeChoices = employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));
        const roleChoices = roles.map(role => ({ name: role.title, value: role.id })).concat({ name: 'Add a new role', value: 'add_new_role' });

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Select an employee to update:',
                choices: employeeChoices,
            }
        ]);

        // Fetch and display current details of the selected employee
        const currentDetails = await dbQueries.getEmployeeById(answers.employeeId);
        console.table(currentDetails);
        console.log("You are viewing current details of the selected employee\n");

        const roleAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'newRoleIdOrAdd',
                message: 'Select the new role for this employee:',
                choices: roleChoices,
            }
        ]);

        if (roleAnswer.newRoleIdOrAdd === 'add_new_role') {
            await addRolePrompt();
            continue;  // Go back to the start of the loop after adding the role
        }

        await dbQueries.updateEmployeeRole(answers.employeeId, roleAnswer.newRoleIdOrAdd);

        // Display updated employee details
        const updatedDetails = await dbQueries.getEmployeeById(answers.employeeId);
        console.table(updatedDetails);
        const updatedEmployee = employees.find(emp => emp.id === answers.employeeId);
        console.log(`You are viewing ${updatedEmployee.first_name} ${updatedEmployee.last_name}s updated information\n`);

        // Ask if user wants to update another employee
        const nextAction = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'updateAnother',
                message: 'Would you like to update another employee?',
                default: false
            }
        ]);

        if (!nextAction.updateAnother) {
            break;
        }
    }
    main();
}

module.exports = {
    handleRolePrompts: async (main) => {
        const roleAction = await inquirer.prompt([
            {
                type: 'list',
                name: 'roleAction',
                message: 'What would you like to do with roles?',
                choices: [
                    'View all roles',
                    'View roles by department',
                    'Add a role',
                    'Delete a role',
                    'Update an employee role',
                ],
            },
        ]);

        const selectedRoleAction = roleAction.roleAction;

        if (selectedRoleAction === 'View all roles') {
            await viewAllRoles(main);
        } else if (selectedRoleAction === 'View roles by department') {
            await viewRolesByDepartmentPrompt(main);
        } else if (selectedRoleAction === 'Add a role') {
            await addRolePrompt(main);
        } else if (selectedRoleAction === 'Delete a role') {
            await deleteRolePrompt(main);
        } else if (selectedRoleAction === 'Update an employee role') {
            await updateEmployeeRole(main);
        }
    },
};