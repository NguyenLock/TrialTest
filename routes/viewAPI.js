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
viewsRouter.route("/add")
    .get(ensureAuthenticated, viewsController.getAddPage)
    .post(ensureAuthenticated, viewsController.add)    
viewsRouter.route("/edit/:sectionId")
    .get(ensureAuthenticated, viewsController.getEditPage)
    .post(ensureAuthenticated, viewsController.edit)    
viewsRouter.route("/delete/:sectionId")    
    .get(ensureAuthenticated, viewsController.getDeletePage)
    .post(ensureAuthenticated, viewsController.delete)
module.exports = viewsRouter;    