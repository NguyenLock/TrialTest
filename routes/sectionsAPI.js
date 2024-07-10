const express = require('express');
const sectionsAPIRouter = express.Router();
const sectionsController = require('../controllers/sectionController');

sectionsAPIRouter.route("/")
    .get(sectionsController.APIGet)

module.exports = sectionsAPIRouter;    