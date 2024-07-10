const express = require('express');
const membersAPIRouter = express.Router();
const membersController = require('../controllers/memberController');

membersAPIRouter.route("/lgoin")
    .post(membersController.APILogin)

    module.exports = membersAPIRouter;