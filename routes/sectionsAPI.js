const express = require('express');
const sectionsAPIRouter = express.Router();
const sectionsController = require('../controllers/sectionController');
const {authenticateToken} = require('../config/auth')

sectionsAPIRouter.route("/")
    .get(authenticateToken,sectionsController.APIGet)

module.exports = sectionsAPIRouter;    