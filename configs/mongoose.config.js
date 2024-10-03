const mongoose = require('mongoose');

const db = mongoose.connect("mongodb://localhost:27017/course-selling-website")
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.log(`Error in connecting to db : ${error}`);
        
    });


module.exports = db;