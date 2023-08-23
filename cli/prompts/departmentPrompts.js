const inquirer = require('inquirer');
const dbQueries = require('../../db/queries');

// VIEW ALL DEPARTMENTS
async function viewAllDepartments(main) { // <-- accept main as a parameter
    const departments = await dbQueries.getAllDepartments();
    console.table(departments);

    main(); // return to start
}

// ADD A DEPARTMENT
async function addDepartmentPrompt(main) {
    // 1. Ask the user for the name of the new department
    const departmentPrompt = {
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department:',
    };
    const answers = await inquirer.prompt(departmentPrompt);

    // 2. Add the department to the database
    await dbQueries.addDepartment(answers.departmentName);

    // 3. Display all departments, including the newly added one
    const departments = await dbQueries.getAllDepartments();
    console.table(departments);

    console.log(`Added department: ${answers.departmentName}`);

    // 4. Ask the user if they'd like to add another department
    const continuePrompt = {
        type: 'confirm', // This will provide a 'y/n' choice
        name: 'continueAdding',
        message: 'Would you like to add another department?',
    };
    const continueAnswer = await inquirer.prompt(continuePrompt);

    if (continueAnswer.continueAdding) {
        await addDepartmentPrompt(main);
    } else {
        main();
    }
}

// DELETE A DEPARTMENT
async function deleteDepartmentPrompt(main) {
    // Get all departments from the database
    const departments = await dbQueries.getAllDepartments();

    const departmentChoices = departments.map((department) => ({
        name: department.name,
        value: department.id,
    }));

    const deletePrompt = {
        type: 'list',
        name: 'departmentToDelete',
        message: 'Select a department to delete:',
        choices: departmentChoices,
    };

    const answers = await inquirer.prompt(deletePrompt);

    // Get the name of the department to delete for display purposes
    const departmentToDeleteName = departmentChoices.find(choice => choice.value === answers.departmentToDelete).name;

    // Delete the selected department
    await dbQueries.deleteDepartment(answers.departmentToDelete);

    // Display all departments after the delete operation
    const updatedDepartments = await dbQueries.getAllDepartments();
    console.table(updatedDepartments);

    // Now print using the saved department name
    console.log(`Deleted department: ${departmentToDeleteName}`);

    // Ask if the user wants to delete another department
    const continueDeletePrompt = {
        type: 'confirm', // This will provide a 'y/n' choice
        name: 'continueDeleting',
        message: 'Would you like to delete another department?',
    };
    const continueDeleteAnswer = await inquirer.prompt(continueDeletePrompt);

    if (continueDeleteAnswer.continueDeleting) {
        await deleteDepartmentPrompt(main);
    } else {
        main();
    }
}

// VIEW DEPARTMENT BUDGET
async function viewDepartmentBudget(main) {
    try {
        // 1. Fetch all departments
        const departments = await dbQueries.getAllDepartments();
        console.table(departments);

        // 2. Prompt user to select a department
        const departmentChoices = departments.map(dept => ({ name: dept.name, value: dept.id }));
        const { departmentId } = await inquirer.prompt([
            {
                type: 'list',
                name: 'departmentId',
                message: 'Select a department to view its total budget:',
                choices: departmentChoices,
            }
        ]);

        // 3. Fetch employee information for the chosen department
        const employeesInDepartment = await dbQueries.viewEmployeesByDepartment(departmentId);
        if (employeesInDepartment && employeesInDepartment.length > 0) {
            console.table(employeesInDepartment);
            // 4. Fetch and display the budget
            const totalBudget = await dbQueries.getDepartmentBudget(departmentId);
            console.log(`Total utilized budget for department: $${totalBudget}`);
        } else {
            console.log('No employees found for this department.');
        }

        // 5. Ask the user if they want to view another department's budget
        const { another } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'another',
                message: 'Would you like to view the budget of another department?',
            }
        ]);

        // 6. Decide next steps based on the user's response
        if (another) {
            viewDepartmentBudget(main); // Run the same function again
        } else {
            main(); // Return to main menu
        }
    } catch (error) {
        console.error("An error occurred:", error);
        main(); // If an error occurs, return to main menu for simplicity
    }
}

module.exports = {
    handleDepartmentPrompts: async (main) => {
        const departmentAction = await inquirer.prompt([
            {
                type: 'list',
                name: 'departmentAction',
                message: 'What would you like to do with departments?',
                choices: [
                    'View all departments',
                    'Add a department',
                    'Delete a department',
                    'View department budget'
                ],
            },
        ]);

        const selectedDepartmentAction = departmentAction.departmentAction;

        if (selectedDepartmentAction === 'View all departments') {
            await viewAllDepartments(main);
        } else if (selectedDepartmentAction === 'Add a department') {
            await addDepartmentPrompt(main);
        } else if (selectedDepartmentAction === 'Delete a department') {
            await deleteDepartmentPrompt(main);
        } else if (selectedDepartmentAction === 'View department budget') {
            await viewDepartmentBudget(main);
        }
    },
};