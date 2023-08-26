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

// VIEW ALL EMPLOYEES
// The COALESCE function checks the values in the order they're provided and returns the first non-null value.
async function getAllEmployees() {
    try {
        const [results] = await db.promise().query(`
            SELECT employees.id, employees.first_name, employees.last_name, roles.title AS role_name, 
            COALESCE(employees.custom_salary, roles.salary) AS employee_salary,
            departments.name AS department_name, CONCAT(managers.first_name, ' ', managers.last_name) AS manager_name 
            FROM employees 
            LEFT JOIN roles ON employees.role_id = roles.id 
            LEFT JOIN departments ON roles.department_id = departments.id 
            LEFT JOIN employees AS managers ON employees.manager_id = managers.id
        `);
        return results;
    } catch (err) {
        throw new Error(err);
    }
}

// VIEW ALL MANAGERS
async function getAllManagers() {
    try {
        const query = `
            SELECT 
                m.id, 
                CONCAT(m.first_name, " ", m.last_name) AS manager_name,
                GROUP_CONCAT(DISTINCT d.name) AS departments_managed,
                COUNT(e.id) AS number_of_employees,
                SUM(r.salary) AS total_budget
            FROM employees m
            LEFT JOIN employees e ON m.id = e.manager_id
            LEFT JOIN roles r ON e.role_id = r.id
            LEFT JOIN departments d ON r.department_id = d.id
            WHERE e.manager_id IS NOT NULL
            GROUP BY m.id
            ORDER BY m.id;
        `;
        const [results] = await db.promise().query(query);
        return results;
    } catch (err) {
        throw new Error(err);
    }
}

async function getSimpleManagersList() {
    try {
        const query = `
            SELECT id, first_name, last_name 
            FROM employees 
            WHERE is_manager = 1;
        `;
        const [results] = await db.promise().query(query);
        return results;
    } catch (err) {
        throw new Error(err);
    }
}

// GET EMPLOYEES BY MANAGER
async function getEmployeesByManager(managerId) {
    try {
        const [results] = await db.promise().query(`
            SELECT 
                e.id, 
                e.first_name, 
                e.last_name, 
                r.title AS role_name, 
                d.name AS department_name, 
                r.salary
            FROM employees e
            LEFT JOIN roles r ON e.role_id = r.id
            LEFT JOIN departments d ON r.department_id = d.id
            WHERE e.manager_id = ?
        `, [managerId]);
        return results;
    } catch (err) {
        throw new Error(err);
    }
}

// VIEW EMPLOYEE BY DEPARTMENT
async function getEmployeesByDepartment(departmentId) {
    try {
        const query = `
            SELECT 
                employees.id, 
                employees.first_name, 
                employees.last_name, 
                roles.title AS role_name, 
                departments.name AS department_name, 
                CONCAT(managers.first_name, ' ', managers.last_name) AS manager_name,
                roles.salary
            FROM employees 
            JOIN roles ON employees.role_id = roles.id 
            JOIN departments ON roles.department_id = departments.id
            LEFT JOIN employees AS managers ON employees.manager_id = managers.id
            WHERE roles.department_id = ?
        `;
        const [results] = await db.promise().query(query, [departmentId]);
        return results;
    } catch (err) {
        throw new Error(err);
    }
}

// ADD AN EMPLOYEE
async function addEmployee(employeeData) {
    try {
        const [results] = await db.promise().query("INSERT INTO employees SET ?", employeeData);
        return results.insertId;
    } catch (err) {
        throw new Error(err);
    }
}

// UPDATE AN EMPLOYEES MANAGER
async function updateEmployeeManager(employeeId, newManagerId) {
    try {
        await db.promise().query("UPDATE employees SET manager_id = ? WHERE id = ?", [newManagerId, employeeId]);
    } catch (err) {
        throw new Error(err);
    }
}

// REMOVE AN EMPLOYEE
async function deleteEmployee(id) {
    try {
        await db.promise().query("DELETE FROM employees WHERE id = ?", [id]);
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
        LEFT JOIN roles ON employees.role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
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
    getAllEmployees,
    getAllManagers,
    getSimpleManagersList,
    getEmployeesByManager,
    getEmployeesByDepartment,
    addEmployee,
    updateEmployeeManager,
    deleteEmployee,
    getEmployeeById,

    // roles
    getAllRoles,
    addRole,
    deleteRole,
    updateEmployeeRole,
    getRolesByDepartmentId,
};