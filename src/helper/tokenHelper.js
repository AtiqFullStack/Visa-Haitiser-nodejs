const jwt = require('jsonwebtoken');
const { JWT_EXPIRE, JWT_SECRET } = require('../utils/cofig');

const blacklistedTokens = new Set();

const generateToken = (payload, expiresIn = JWT_EXPIRE) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
    if (blacklistedTokens.has(token)) {
        throw new Error('Token has been blacklisted');
    }
    return jwt.verify(token, JWT_SECRET);
};

const blacklistToken = (token) => {
    blacklistedTokens.add(token);
};

module.exports = {
    generateToken,
    verifyToken,
    blacklistToken
};
