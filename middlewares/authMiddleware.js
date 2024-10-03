const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const { token } = req.headers;

        const isTokenRight = jwt.verify(token, process.env.JWT_SECRET_KEY); 
        
        if (isTokenRight) {
            req.body.id = isTokenRight.id
            next();
        } 
    } catch (error) {
        return res.status(401).json({
            message: "Unautherized",
            error: error.message
        })
    }
}

module.exports = authMiddleware;