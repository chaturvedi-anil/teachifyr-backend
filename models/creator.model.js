const mongoose = require("mongoose");

const creatorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
},
{
    timestamps: true
});

const Creator = mongoose.model('Creator', creatorSchema);


module.exports = Creator;