const Sections = require("../models/section");
const Courses = require("../models/courses");
const passport = require("passport");
const mongoose = require("mongoose");

class viewsController {
  async getLoginPage(req, res, next) {
    try {
      res.render("login", { title: "Login" });
    } catch (error) {
      console.error("Error rendering login page:", error);
      res.render("error"); // Render error page if rendering login fails
    }
  }
  async login(req, res, next) {
    try {
      passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/",
        failureFlash: true,
      })(req, res, next);
    } catch (error) {
      res.render("error");
    }
  };
  async logout(req,res,next){
    try{
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            req.flash("success_msg", "You are logged out");
            res.redirect("/")
        })
    }catch(error){
        res.render("error");
    }
  }
  async getDashboard(req, res, next) {
    try {
      const sections = await Sections.find({}).populate("course");
      res.render("dashboard", {
        title: "Dashboard",
        sections,
      });
    } catch (error) {
      res.render("error");
    }
  };
}

module.exports = new viewsController();
