const express = require('express');
const coursesAPIRouter = express.Router();
const coursesController = require('../controllers/coursesController');

coursesAPIRouter.route("/")
    .get(coursesController.APIGET)
    .post(coursesController.APIPost)
coursesAPIRouter.route("/:courseId")
    .get(coursesController.APIGetById)
    .put(coursesController.APIPutById)
    .delete(coursesController.APIDeleteById)    

    module.exports = coursesAPIRouter;  