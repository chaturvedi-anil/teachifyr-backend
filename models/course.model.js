const mongoose = require('mongoose');

const courseShcema = mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Creator"
    },
},
{
    timestamps: true
})

const Courses = mongoose.model('Courses', courseShcema);

module.exports = Courses;

