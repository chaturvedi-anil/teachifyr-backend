const express = require("express");
const creatorRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddleware.js");
const { signIn, signUp, profile, createCourse, deleteCourse, addCourseContent } = require("../controllers/creator.controllers.js");


creatorRouter.post('/signup', signUp);
creatorRouter.post('/signin', signIn);
creatorRouter.get('/profile', authMiddleware ,profile);
creatorRouter.post('/new-course', authMiddleware ,createCourse);
creatorRouter.delete('/delete-course/:id', authMiddleware, deleteCourse);
creatorRouter.post('/add-course-content/:id', authMiddleware, addCourseContent);


module.exports = creatorRouter;
