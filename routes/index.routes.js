const express = require("express");
const usersRouter = require('./users.routes.js');
const creatorRouter = require('./creator.routes.js');
const { courseList } = require('../controllers/course.controllers.js');
const indexRouter = express.Router();


indexRouter.get('/ping', (req, res) => {
    res.json({
        message : "express server is running"
    })
})
indexRouter.get('/courses', courseList);
indexRouter.use("/user", usersRouter);
indexRouter.use("/creator", creatorRouter);

module.exports = indexRouter;