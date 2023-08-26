const express = require('express');
const api = require('./routes/index');
const dbConnection = require('./config/connection'); // Importing the SQL connection
const { main } = require('./cli/main');

const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Send all the requests that begin with /api to the index.js in the routes folder
app.use('/api', api);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    // console.log(`Server running on http://localhost:${PORT}`);
});