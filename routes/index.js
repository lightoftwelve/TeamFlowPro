const express = require('express');
const router = express.Router();
const { main } = require('../cli/main');

const departmentRouter = require('./departmentRouter');
// const employeeRouter = require('./employeeRouter');
// const roleRouter = require('./roleRouter');

router.use('/departments', departmentRouter);
// router.use('/employees', employeeRouter);
// router.use('/roles', roleRouter);

router.get('/getting-started', async (req, res) => {
    try {
        // Call the main function to initiate prompts and logic
        await main();
        res.send('Prompts completed.');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred.');
    }
});

module.exports = router;