const express = require("express");
const usersRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddleware.js");
const { signIn, signUp, profile, purchaseCourse, listOfPurchaseCourses } = require("../controllers/user.controllers.js");

usersRouter.post('/signup', signUp);
usersRouter.post('/signin', signIn);
usersRouter.get('/profile', authMiddleware ,profile);

module.exports = usersRouter;