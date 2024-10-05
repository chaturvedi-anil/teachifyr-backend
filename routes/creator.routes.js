const express = require("express");
const creatorRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddleware.js");
const { signIn, signUp, profile, createCourse, deleteCourse, updateCourse, addCourseContent } = require("../controllers/creator.controllers.js");


creatorRouter.post('/signup', signUp);
creatorRouter.post('/signin', signIn);
creatorRouter.get('/profile', authMiddleware ,profile);
creatorRouter.post('/course', authMiddleware ,createCourse);
creatorRouter.put('/course', authMiddleware, updateCourse);
creatorRouter.delete('/delete-course/:courseId', authMiddleware, deleteCourse);
creatorRouter.post('/add-course-content/:courseId', authMiddleware, addCourseContent);


module.exports = creatorRouter;
