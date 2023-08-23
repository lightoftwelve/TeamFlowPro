const db = require('../config/connection');

// DEPARTMENTS

// VIEW ALL DEPARTMENTS
async function getAllDepartments() {
    try {
        const [results] = await db.promise().query('SELECT * FROM departments');
        return results;
    } catch (err) {
        throw new Error(err);
    }
}

// ADD A DEPARTMENT
async function addDepartment(name) {
    try {
        const [results] = await db.promise().query("INSERT INTO departments (name) VALUES (?)", [name]);
        return results.insertId;
    } catch (err) {
        throw new Error(err);
    }
}

// DELETE A DEPARTMENT
async function deleteDepartment(id) {
    try {
        await db.promise().query("DELETE FROM departments WHERE id = ?", [id]);
    } catch (err) {
        throw new Error(err);
    }
}

// VIEW DEPARTMENT BUDGET
async function getDepartmentBudget(departmentId) {
    try {
        const [results] = await db.promise().query(`
            SELECT SUM(roles.salary) as totalBudget 
            FROM employees 
            JOIN roles ON employees.role_id = roles.id 
            WHERE roles.department_id = ?
        `, [departmentId]);
        return results[0].totalBudget;
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = {
    getAllDepartments,
    addDepartment,
    deleteDepartment,
    getDepartmentBudget,
};