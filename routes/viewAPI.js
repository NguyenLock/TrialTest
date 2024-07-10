const express = require("express")
const viewsRouter = express.Router();
const viewsController = require("../controllers/viewController");
const {ensureAuthenticated, forwardAuthenticated} = require("../config/auth");

viewsRouter.route("/")
    .get(forwardAuthenticated, viewsController.getLoginPage)
    .post(viewsController.login)
viewsRouter.route("/logout")
    .get(viewsController.logout)    
viewsRouter.route("/dashboard")
    .get(ensureAuthenticated, viewsController.getDashboard)    
module.exports = viewsRouter;    