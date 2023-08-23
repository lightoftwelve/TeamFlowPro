const express = require('express');
const router = express.Router();
const queries = require('../db/queries')

// Route for getting all departments
router.get('/', async (req, res) => {
    try {
        const departments = await queries.getAllDepartments();
        res.json(departments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for adding a department
router.post('/', async (req, res) => {
    const departmentName = req.body.name;
    try {
        const newDepartmentId = await queries.addDepartment(departmentName);
        res.json({ id: newDepartmentId, name: departmentName });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for deleting a department by ID
router.delete('/:id', async (req, res) => {
    const departmentId = req.params.id;
    try {
        await queries.deleteDepartment(departmentId);
        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;