const { z } = require('zod');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Creators = require('../models/creator.model.js');
const Courses = require('../models/course.model.js');
const Purchase = require('../models/purchase.model.js');
const { passwordRegex } = require("../constant.js");

 
const signUp = async (req, res) => {
    try {
        // zod schema for input validation
        const requireBody = z.object({
            name: z.string()
                .min(3, {message: "Name must be at least 3 characters long!"})
                .max(100, {message: "Name must be at most 100 characters long!"}),
            
            email: z.string()
                .email({message: "Email should be in valid format!"})
                .min(8, {message: "Email must be at least 8 characters long!"})
                .max(100, {message: "Email must be at most 100 characters long!"}),
            password: z.string()
                .min(8, {message: "Password must be at least 8 characters long!"})
                .max(32, {message: "Password must be at most 32 characters long!"})
                .regex(passwordRegex, {message: "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"})
        })

        const parseResult = requireBody.safeParse(req.body);

        if(!parseResult.success){
            return res.status(400).json({
                    message: "Bad Request",
                    error: parseResult.error.errors
                });
        } else {
            const { name, email, password } = req.body;
            const isEmailPresent = await Creators.findOne({email: email});

            if(isEmailPresent){
                return res.status(400).json({
                        message: `Creator with ${email} email already exists!`
                    })
            } else {
                const hashPassword = await bcrypt.hash(password, 10);

                const newCreator = await Creators.create({
                    name: name,
                    email: email,
                    password: hashPassword
                })

                if(newCreator){
                    return res.status(201).json({
                            message: "Signup completed successfully"
                        })
                }
            }
        }

    } catch (error) {
        return res.status(500).json({
                error: error.message
            });
    }
}

const signIn = async (req, res) => {
    try {
        const requireBody = z.object({
            email: z.string()
                .email({message: "Email should be in valid format!"})
                .min(8, {message: "Email must be at least 8 characters long!"})
                .max(100, {message: "Email must be at most 100 characters long!"}),
            password: z.string()
                .min(8, {message: "Password must be at least 8 characters long!"})
                .max(32, {message: "Password must be at most 32 characters long!"})
                .regex(passwordRegex, {message: "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"})
        });

        const parseResult = requireBody.safeParse(req.body);

        if(!parseResult.success){
            return res.status(400).json({
                message: "Bad Request",
                error: parseResult.error.errors
            });
        } else {
            const { email, password } = req.body;
            const isCreatorPresent = await Creators.findOne({email: email});

            if(!isCreatorPresent){
                return res.status(400).json({
                        message: `Creator with not present with ${email} email!`
                    })
            } else {
                const isPasswordMatched = await bcrypt.compare(password, isCreatorPresent.password);

                if(isPasswordMatched){
                    const token = jwt.sign({
                        id: isCreatorPresent._id
                    }, process.env.JWT_SECRET_KEY,{
                        expiresIn: "15d"
                    });
                    
                    return res.status(201).json({
                            message: "Signin completed successfully",
                            token: token
                        })
                } else {
                    return res.status(401).json({
                        message: "Unautherized!"
                    })
                }
            }
        }

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

const profile = async (req, res) => {
    try {
        const { id } = req.body;
        if(id){
            const getCreator = await Creators.findById({_id: id});
            if(getCreator){
                return res.status(200).json({
                    message: "Creator found",
                    data: getCreator
                })
            } else {
                return res.status(400).json({
                    message: "Creator not found!"
                })
            }
        } else {
            return res.status(400).json({
                message: "Creator not found!"
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

const createCourse = async (req, res) => {
    try {
        const requireBody = z.object({
            title: z.string()
                .min(3, {message: "Name must be at least 3 characters long!"})
                .max(500, {message: "Name must be at most 100 characters long!"}),
            description: z.string()
                .min(20, { message: "Description must be at least 20 characters long!"})
                .max(300, {message: "Description must be at most 300 characters long!"}),
            price: z.number(),
            
            imageUrl: z.string().url({message: "Please give proper image URL!"})
        });

        const parseResult = requireBody.safeParse(req.body);

        if(!parseResult.success){
            return res.status(400).json({
                message: "Bad Request",
                error: parseResult.error.errors
            })
        } else {
            const { id, title, description, price, imageUrl } = req.body;

            const isCoursePresent = await Courses.findOne({creatorId: id, title: title});
            
            if(isCoursePresent){
                return res.status(400).json({
                    message: `Course already exists with ${title} title!`,
                });
            } else {
                const newCourse = await Courses.create({
                    title: title,
                    description: description,
                    price: price,
                    imageUrl: imageUrl,
                    creatorId: id
                });

                if(newCourse){
                    return res.status(200).json({
                        message: "New Course Added Successfully!"
                    });
                }
            }
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

const updateCourse = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}
const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        const deletedCourse = await Courses.findByIdAndDelete(courseId);
        

        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        } else {
            const deletedPurchased = await Purchase.deleteMany({courseId: courseId});

            
            return res.status(200).json({ message: 'Course deleted successfully', deletedPurchased: deletedPurchased, deletedCourse: deletedCourse });
        }
        
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

const addCourseContent = (req, res) => {
    try {
        
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}


module.exports = {
    signUp, signIn, profile, createCourse, deleteCourse, updateCourse, addCourseContent
}