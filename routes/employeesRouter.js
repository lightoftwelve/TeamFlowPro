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



module.exports = router;