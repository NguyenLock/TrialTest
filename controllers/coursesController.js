const mongoose = require("mongoose");
const Courses = require("../models/courses");
const Sections = require("../models/section");

class courseController {
  //[GET]API GET
  async APIGET(req, res, next) {
    try {
      const courses = await Courses.find({});
      res.status(200).json({
        status: "success",
        message: "Get Data Success",
        data: courses,
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: "Internet Server Error",
        Description: error.message,
      });
    }
  }
  async APIPost(req, res, next) {
    try {
      const { courseName, courseDescription } = req.body;
      if (
        !courseName ||
        courseName.trim().length == 0 ||
        !courseDescription ||
        courseDescription.trim().length == 0
      ) {
        return res.status(400).json({
          status: "Error",
          message: "Missing Parameter",
          Description: "Please provide courseName and courseDescription",
        });
      }
      const course = await Courses.findOne({ courseName: courseName });
      if (!course) {
        const newCourse = await Courses.create(req.body);
        return res.status(200).json({
          status: "success",
          message: "Create brand successful",
          data: newCourse,
        });
      } else {
        res.status(400).json({
          status: "error",
          message: "Course is existed",
          description: `Course with name ${courseName} is existed.`,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: "Internet Server Error",
        Description: error.message,
      });
    }
  }
  async APIGetById(req, res, next) {
    try {
      const courseId = req.params.courseId;
      //check CourseId
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
          status: "Error",
          message: "Missing Parameter",
          Description: `The course ID ${courseId} is not a valid ObjectId.`,
        });
      }
      const course = await Courses.findById(courseId);
      if (!course) {
        return res.status(400).json({
          status: "Error",
          message: "Not Found",
          Description: `The course ID ${courseId} is not found.`,
        });
      }
      res.status(200).json({
        status: "success",
        message: "Get Data Success",
        data: course,
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: "Internet Server Error",
      });
    }
  }
  // Trong controllers/coursesController.js

  async APIPutById(req, res, next) {
    try {
      const courseId = req.params.courseId;
      const { courseName, courseDescription } = req.body;
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid course ID",
          description: `The course ID ${courseId} is not a valid ObjectId.`,
        });
      }
      const course = await Courses.findById(courseId);
      if (course) {
        if (courseName) {
          if (courseName.trim().length == 0) {
            return res.status(400).json({
              status: "error",
              message: "Validation error",
              description: `courseName is required.`,
            });
          }
          if (courseName == course.courseName) {
            return res.status(400).json({
              status: "error",
              message: "Validation error",
              description: `New courseName is the same as old courseName`,
            });
          }
          const duplicateInfo = await Courses.findOne({
            _id: { $ne: courseId },
            courseName: courseName,
          });
          if (duplicateInfo) {
            return res.status(400).json({
              status: "error",
              message: "Validation error",
              description: `courseName is existed`,
            });
          }
          course.courseName = courseName;
          await course.save();
        }
        if (courseDescription) {
          if (courseDescription.trim().length == 0) {
            return res.status(400).json({
              status: "error",
              message: "Validation error",
              description: `courseDescription is required.`,
            });
          }
          if (courseDescription == course.courseDescription) {
            return res.status(400).json({
              status: "error",
              message: "Validation error",
              description: `New courseDescription is the same as old courseDescription`,
            });
          }
          const duplicateInfo = await Courses.findOne({
            _id: { $ne: courseId },
            courseDescription: courseDescription,
          });
          if (duplicateInfo) {
            return res.status(400).json({
              status: "error",
              message: "Validation error",
              description: `courseDescription is existed`,
            });
          }
          course.courseDescription = courseDescription;
          await course.save();
        }
        return res.status(200).json({
          status: "success",
          message: "Update Course Success",
        });
      } else {
        return res.status(404).json({
          status: "error",
          message: "Not found",
          description: `Course is not found.`,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        description: error.message,
      });
    }
  }
  async APIDeleteById(req, res, next) {
    try {
      const courseId = req.params.courseId;
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid course ID",
          description: `The course ID ${courseId} is not a valid ObjectId.`,
        });
      }
      const course = await Courses.findById(courseId);
      if (course) {
        const sections = await Sections.find({ course: courseId });
        if (sections.length > 0) {
          return res.status(400).json({
            status: "error",
            message: "Course is active",
            description: `The course is in section(s) so can not delete.`,
          });
        } else {
          await course.deleteOne();
          return res.status(200).json({
            status: "success",
            message: "Delete Course Success",
          });
        }
      } else {
        return res.status(404).json({
          status: "error",
          message: "Not Found",
          description: `The course ID ${courseId} is not found.`,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        description: error.message,
      });
    }
  }
}

module.exports = new courseController();
