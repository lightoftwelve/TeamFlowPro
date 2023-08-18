# TeamFlow Pro

## Overview
TeamFlow Pro is a powerful command-line interface tool designed to streamline the management of organizational structures. With intuitive commands, it empowers users to effortlessly handle departments, roles, and employees within an organization. The app provides an efficient way to view all departments, roles, and employees through formatted tables, making it easy to access essential information. Users can seamlessly add new departments, roles, and employees, ensuring that the organizational structure remains up-to-date. Moreover, the app allows for the dynamic updating of employee roles, maintaining accurate records across the board. Experience a hassle-free approach to organizational management with the TeamFlow Pro.

## Table of Contents
- [Features](#features)
- [Usage Guide](#usage-guide)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Demonstration](#demonstration)
- [Credits](#credits)
- [License](#license)

## Features
- **View Options**: Upon launching the application, users are presented with several options for interacting with the database.
- **View All Departments**: Users can view all departments, seeing their names and IDs in a formatted table.
- **View All Roles**: Display details including job title, role id, the department that role belongs to, and the salary for that role.
- **View All Employees**: See a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to.
- **Add a Department**: Users can add a new department to the database.
- **Add a Role**: Add a new role with specified details into the database.
- **Add an Employee**: Users can add a new employee's details to the database.
- **Update an Employee Role**: Modify the role of an existing employee in the database.

## Usage Guide
1. **Installation**:
    ```bash
    git clone git@github.com:lightoftwelve/TeamFlowPro.git
    cd teamflowpro
    npm install
    ```

2. **Setting up the Database**:
    Navigate to the `db` folder and run the `schema.sql` in your preferred database tool (e.g., MySQL Workbench) to set up the database tables. Optionally, run the `seeds.sql` to populate the tables with sample data.

3. **Starting the Application**:
    ```bash
    node index.js
    ```

    Follow the on-screen prompts to interact with the application.

## Screenshots
// coming soon

## Technologies Used
- Node.js
- Inquirer
- MySQL

## Demonstration
// Not live yet
Link: [Watch Here](https://github.com/lightoftwelve)

## Credits
This project was independently developed by myself, Victoria Alawi.
- Github: [@lightoftwelve](https://github.com/lightoftwelve)
- LinkedIn: [@Victoria Alawi](https://www.linkedin.com/in/victoria-alawi-872984250/)
- Website: [www.lightoftwelve.com](http://www.lightoftwelve.com)

## License 
This project is licensed under the [MIT License](/LICENSE).