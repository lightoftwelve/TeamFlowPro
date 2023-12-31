// Required modules
const inquirer = require('inquirer');
const prompt = require('prompt-sync')();

// Function to display a welcome message
async function welcomeMessage() {
    try {
        console.log(`Welcome to                                  
 _____               _____ _              _____         
 |_   _|___ ___ _____|   __| |___ _ _ _   |  _  |___ ___ 
   | | | -_| .'|     |   __| | . | | | |  |   __|  _| . |
   |_| |___|__,|_|_|_|__|  |_|___|_____|  |__|  |_| |___|                                                      
        `);

        // Prompt the user to press ENTER to continue
        prompt('Press ENTER to continue...');
        // Call the main function
        main();
    } catch (error) {
        // Log any errors that occur
        console.error('Error displaying welcome message:', error);
    }
}

// Main function
async function main() {
    try {
        const mainChoices = [
            'Manage departments',
            'Manage roles',
            'Manage employees',
        ];

        // Prompt the user to select a choice
        const userChoices = await inquirer.prompt([
            {
                type: 'list',
                name: 'mainChoice',
                message: 'What would you like to do?',
                choices: mainChoices,
            },
        ]);

        const selectedChoice = userChoices.mainChoice;

        // Call the appropriate module based on the selected choice
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
        // Log any errors that occur
        console.error("\nAn error occurred:", error.message);
        // Ask the user if they want to continue after an error
        const shouldContinue = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'continue',
                message: 'Do you want to continue?',
                default: true
            }
        ]);
        if (shouldContinue.continue) {
            // Call the main function again if the user wants to continue
            main();
        } else {
            // Exit the application if the user does not want to continue
            console.log("Goodbye!");
            process.exit(1); // Exit with an error code
        }
    }
}

welcomeMessage();