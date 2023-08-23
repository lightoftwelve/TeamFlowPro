const inquirer = require('inquirer');

async function main() {
    const mainChoices = [
        'Manage departments',
        'Manage roles',
        'Manage employees',
    ];

    const userChoices = await inquirer.prompt([
        {
            type: 'list',
            name: 'mainChoice',
            message: 'What would you like to do?',
            choices: mainChoices,
        },
    ]);

    const selectedChoice = userChoices.mainChoice;

    if (selectedChoice === 'Manage departments') {
        const departmentPromptsModule = require('./prompts/departmentPrompts');
        await departmentPromptsModule.handleDepartmentPrompts(main); // <-- pass the main function as a parameter
    } else if (selectedChoice === 'Manage employees') {
        const employeePromptsModule = require('./prompts/employeePrompts');
        await employeePromptsModule.handleEmployeePrompts(main);
    } else if (selectedChoice === 'Manage roles') {
        const rolePromptsModule = require('./prompts/rolePrompts');
        await rolePromptsModule.handleRolePrompts(main);
    }
}

main();