const db = require('../config/connection');

// --------------------------------------------------------
//                           Departments
// --------------------------------------------------------

// VIEW ALL DEPARTMENTS
async function getAllDepartments() {
    try {
        const [results] = await db.promise().query(`
            SELECT 
                departments.id,
                departments.name,
                COUNT(DISTINCT roles.id) AS number_of_roles,
                COUNT(DISTINCT employees.id) AS number_of_employees
            FROM departments
            LEFT JOIN roles ON departments.id = roles.department_id
            LEFT JOIN employees ON roles.id = employees.role_id
            GROUP BY departments.id, departments.name
        `);
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

// --------------------------------------------------------
//                            Employees
// --------------------------------------------------------

// VIEW EMPLOYEES BY DEPARTMENT
async function viewEmployeesByDepartment(departmentId) {
    try {
        const [results] = await db.promise().query(`
        SELECT employees.*, roles.salary 
        FROM employees 
        JOIN roles ON employees.role_id = roles.id 
        WHERE roles.department_id = ?        
        `, [departmentId]);
        return results;
    } catch (err) {
        throw new Error(err);
    }
}

// VIEW EMPLOYEES BY ID
async function getEmployeeById(employeeId) {
    try {
        const query = `
            SELECT employees.id, employees.first_name, employees.last_name, roles.title AS role, roles.salary, departments.name AS department
            FROM employees
            JOIN roles ON employees.role_id = roles.id
            JOIN departments ON roles.department_id = departments.id
            WHERE employees.id = ?;
        `;
        const [results] = await db.promise().query(query, [employeeId]);
        return results;
    } catch (err) {
        throw new Error(err);
    }
}

// --------------------------------------------------------
//                            ROLES
// --------------------------------------------------------

// VIEW ALL ROLES
async function getAllRoles() {
    try {
        const [results] = await db.promise().query(`
            SELECT roles.id, roles.title, roles.salary, departments.name AS department_name
            FROM roles
            JOIN departments ON roles.department_id = departments.id
        `);
        return results;
    } catch (err) {
        throw new Error(err);
    }
}

// VIEW ROLES BY DEPARTMENT
async function getRolesByDepartmentId(departmentId) {
    try {
        const [results] = await db.promise().query(`
            SELECT roles.id, roles.title, roles.salary, departments.name AS department_name
            FROM roles
            JOIN departments ON roles.department_id = departments.id
            WHERE roles.department_id = ?
        `, [departmentId]);
        return results;
    } catch (err) {
        throw new Error(err);
    }
}

// ADD A ROLE
async function addRole({ title, salary, departmentId }) {
    try {
        const [results] = await db.promise().query(
            "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
            [title, salary, departmentId]
        );
        return results.insertId;
    } catch (err) {
        throw new Error(err);
    }
}

// DELETE A ROLE
async function deleteRole(id) {
    try {
        await db.promise().query("DELETE FROM roles WHERE id = ?", [id]);
    } catch (err) {
        throw new Error(err);
    }
}

// UPDATE EMPLOYEE ROLE
async function updateEmployeeRole(employeeId, newRoleId) {
    try {
        await db.promise().query("UPDATE employees SET role_id = ? WHERE id = ?", [newRoleId, employeeId]);
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = {
    // departments
    getAllDepartments,
    addDepartment,
    deleteDepartment,
    getDepartmentBudget,

    // employees
    viewEmployeesByDepartment,
    getEmployeeById,

    // roles
    getAllRoles,
    addRole,
    deleteRole,
    updateEmployeeRole,
    getRolesByDepartmentId
};