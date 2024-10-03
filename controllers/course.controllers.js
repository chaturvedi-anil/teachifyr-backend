const Courses = require('../models/course.model.js');

const courseList = async (req, res) => {
    try {
        const courseList = await Courses.find();
        return res.status(200).json({
            courses: courseList
        }) 
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

module.exports = { courseList };