const { verifyToken } = require('../helper');
const { ApiError } = require('../utils');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        throw new ApiError(401, 'Access token required');
    }
    
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        throw new ApiError(401, 'Invalid token');
    }
};

module.exports = authMiddleware;
