const inquirer = require('inquirer');

async function main() {
    try {
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
    } catch (error) {
        console.error("\nAn error occurred:", error.message);
        const shouldContinue = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'continue',
                message: 'Do you want to continue?',
                default: true
            }
        ]);
        if (shouldContinue.continue) {
            main();
        } else {
            console.log("Goodbye!");
            process.exit(1); // Exit with an error code
        }
    }
}

main();