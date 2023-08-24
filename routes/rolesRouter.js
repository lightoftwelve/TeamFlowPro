// -----------------------------------------------------------------------------
// Note: This Application is Currently a Command Line App
// -----------------------------------------------------------------------------
// This Express app is primarily designed as a command line application that
// uses the 'inquirer' library for interactive prompts and logic. It is built
// to be used in a command line environment and may not have a user interface
// in the traditional sense.
//
// The routes defined below are included for convenience and to allow future
// expansion if someone is interested in building a front-end or web-based
// interface using this application's logic and functionality.
//
// If you're interested in using this app's features in a front-end project,
// you're welcome to build upon these routes or adapt them to your needs.
// However, please keep in mind that the primary focus of this application
// is currently on the command line experience. Also, feel free to delete this notice in your own projects.
//
// Feel free to contact the myself, Victoria Alawi, if you have any questions
// or if you'd like to collaborate on expanding the app's capabilities☺️ :
//
// Author: Victoria Alawi
// Email: info@lightoftwelve.com 
// Github: https://github.com/lightoftwelve
// Website: https://lightoftwelve.com
// Linkedin: https://www.linkedin.com/in/victoria-alawi-872984250
// -----------------------------------------------------------------------------

const express = require('express');
const router = express.Router();
const dbQueries = require('../db/queries')

// Route to get all roles
router.get('/', async (req, res) => {
    try {
        const roles = await dbQueries.getAllRoles();
        res.json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get roles by department
router.get('/department/:departmentId', async (req, res) => {
    try {
        const roles = await dbQueries.getRolesByDepartmentId(req.params.departmentId);
        res.json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to add a role
router.post('/', async (req, res) => {
    try {
        const newRoleId = await dbQueries.addRole(req.body); // Assuming your request body contains title, salary, and departmentId
        res.status(201).json({ id: newRoleId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to delete a role
router.delete('/:roleId', async (req, res) => {
    try {
        await dbQueries.deleteRole(req.params.roleId);
        res.status(204).send();  // 204 No Content for successful deletes without returning data
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;