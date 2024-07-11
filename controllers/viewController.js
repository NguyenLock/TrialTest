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
  }
  async logout(req, res, next) {
    try {
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        req.flash("success_msg", "You are logged out");
        res.redirect("/");
      });
    } catch (error) {
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
  }
  async getAddPage(req, res, next) {
    try {
      const courses = await Courses.find({});
      res.render("add", {
        title: "Add",
        courses,
      });
    } catch (error) {
      res.render("error");
    }
  }
  async add(req, res, next) {
    try {
      const { sectionName, sectionDescription, duration } = req.body;
      const regexName = /^(?:[A-Z][a-zA-Z0-9/]*\s?)*$/;
      let errors = [];
      if (sectionName.trim().length == 0) {
        errors.push({ msg: "Name can not be a space" });
      }
      if (!regexName.test(sectionName)) {
        errors.push({ msg: "Name is not match regex" });
      }
      if (sectionDescription.trim().length == 0) {
        errors.push({ msg: "Description can not be blank" });
      }
      if (duration <= 0) {
        errors.push({ msg: "Duration must greater than 0" });
      }
      const section = await Sections.findOne({ sectionName: sectionName });
      if (section) {
        errors.push({ msg: "Section name is existed" });
      }
      if (errors.length > 0) {
        const courses = await Courses.find({});
        return res.render("add", {
          title: "Add",
          courses,
          errors,
        });
      } else {
        const newSection = new Sections(req.body);
        await newSection.save();
        return res.redirect("/dashboard");
      }
    } catch (error) {
      res.render("error");
    }
  }
  async getEditPage(req, res, next) {
    try {
      const sectionId = req.params.sectionId;
      // Kiểm tra tính hợp lệ của sectionId
      if (!mongoose.Types.ObjectId.isValid(sectionId)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid section ID",
          description: `The section ID ${sectionId} is not a valid ObjectId.`,
        });
      }
      const section = await Sections.findById(sectionId);
      const courses = await Courses.find({});
      res.render("edit", {
        title: "Edit",
        section,
        courses,
      });
    } catch (error) {
      res.render("error");
    }
  }
  async edit(req, res, next) {
    try {
      const { sectionName, sectionDescription, duration } = req.body;
      const regexName = /^(?:[A-Z][a-zA-Z0-9/]*\s?)*$/;
      const sectionId = req.params.sectionId;
      // Kiểm tra tính hợp lệ của sectionId
      if (!mongoose.Types.ObjectId.isValid(sectionId)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid section ID",
          description: `The section ID ${sectionId} is not a valid ObjectId.`,
        });
      }
      let errors = [];
      if (sectionName.trim().length == 0) {
        errors.push({ msg: "Name can not be a space" });
      }
      if (!regexName.test(sectionName)) {
        errors.push({ msg: "Name is not match regex" });
      }
      if (sectionDescription.trim().length == 0) {
        errors.push({ msg: "Description can not be blank" });
      }
      if (duration <= 0) {
        errors.push({ msg: "Duration must greater than 0" });
      }
      const section = await Sections.findOne({
        _id: { $ne: sectionId },
        sectionName: sectionName,
      });
      if (section) {
        errors.push({ msg: "Section name is existed" });
      }
      if (errors.length > 0) {
        const section = await Sections.findById(sectionId);
        const courses = await Courses.find({});
        res.render("edit", {
          title: "Edit",
          section,
          courses,
        });
      } else {
        await Sections.findByIdAndUpdate(
          sectionId,
          {
            $set: req.body,
          },
          { new: true }
        );
        return res.redirect("/dashboard");
      }
    } catch (error) {
      res.render("error");
    }
  }
  async getDeletePage(req, res, next) {
    try {
      const sectionId = req.params.sectionId;
      // Kiểm tra tính hợp lệ của sectionId
      if (!mongoose.Types.ObjectId.isValid(sectionId)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid section ID",
          description: `The section ID ${sectionId} is not a valid ObjectId.`,
        });
      }
      const section = await Sections.findById(sectionId).populate("course");
      res.render("delete", {
        title: "Delete",
        section,
      });
    } catch (error) {
      res.render("error");
    }
  }
  async delete(req, res, next) {
    try {
      const sectionId = req.params.sectionId;
      // Kiểm tra tính hợp lệ của sectionId
      if (!mongoose.Types.ObjectId.isValid(sectionId)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid section ID",
          description: `The section ID ${sectionId} is not a valid ObjectId.`,
        });
      }
      await Sections.findByIdAndDelete(sectionId);
      res.redirect("/");
    } catch (error) {
      res.render("error");
    }
  }
}

module.exports = new viewsController();
