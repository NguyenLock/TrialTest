const express = require('express');
const coursesAPIRouter = express.Router();
const coursesController = require('../controllers/coursesController');
const {authenticateToken} = require('../config/auth')

coursesAPIRouter.route("/")
    .get(authenticateToken,coursesController.APIGET)
    .post(authenticateToken,coursesController.APIPost)
coursesAPIRouter.route("/:courseId")
    .get(authenticateToken,coursesController.APIGetById)
    .put(authenticateToken,coursesController.APIPutById)
    .delete(authenticateToken,coursesController.APIDeleteById)    

    module.exports = coursesAPIRouter;  