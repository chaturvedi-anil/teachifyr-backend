const {z} = require('zod');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Users = require('../models/users.model');
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
            const isEmailPresent = await Users.findOne({email: email});

            if(isEmailPresent){
                return res.status(400).json({
                        message: `User with ${email} email already exists!`
                    })
            } else {
                const hashPassword = await bcrypt.hash(password, 10);

                const newUser = await Users.create({
                    name: name,
                    email: email,
                    password: hashPassword
                })

                if(newUser){
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
            const isUserPresent = await Users.findOne({email: email});

            if(!isUserPresent){
                return res.status(400).json({
                        message: `User with not present with ${email} email!`
                    })
            } else {
                const isPasswordMatched = await bcrypt.compare(password, isUserPresent.password);

                if(isPasswordMatched){
                    const token = jwt.sign({
                        id: isUserPresent._id
                    }, process.env.JWT_SECRET_KEY, {
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
            const getUser = await Users.findById({_id: id});
            if(getUser){
                return res.status(200).json({
                    message: "User found",
                    data: getUser
                })
            } else {
                return res.status(400).json({
                    message: "User not found!"
                })
            }
        } else {
            return res.status(400).json({
                message: "User not found!"
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

const purchaseCourse = async (req, res) => {
    try {
        const { id, courseId } = req.body;
        
        const isPurchased = await Purchase.findOne({userId: id, courseId: courseId});

        if(isPurchased){
            return res.status(400).json({
                message: "You have already purchased this course!",
            });

        } else {
            const newPurchased = await Purchase.create({
                userId: id,
                courseId: courseId
            });

            if(newPurchased){
                return res.status(200).json({
                    message: "You have successfully purchased this course!"
                });
            }
        }

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

const listOfPurchaseCourses = async (req, res) => {
    try {   
        const { id } = req.body;

        const listOfCourses = await Purchase.find({userId: id})
            .populate('courseId')
            .exec();

        console.log("listOfCourses : ", listOfCourses);
        
        
        if (listOfCourses) {
            return res.status(200).json({
                data: listOfCourses
            })
        } else {
            return res.status(200).json({
                message: "You did not purchase any courses!"
            })
        }
    } catch (error) {
         return res.status(500).json({
            error: error.message
        });
    }
}

module.exports = {
    signUp, signIn, profile, purchaseCourse, listOfPurchaseCourses
}