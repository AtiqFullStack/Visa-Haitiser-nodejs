const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://visahaitiser:visahaitiser@cluster0.rr2cdy1.mongodb.net/?appName=Cluster0";
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "30d";
const JWT_COOKIE_EXPIRE = process.env.JWT_COOKIE_EXPIRE || 30;
const NODE_ENV = process.env.NODE_ENV || "development";
const SALT_ROUND = process.env.SALT_ROUND || 15;
const GEETEST_ID = process.env.GEETEST_ID || "2d3cf37005b89b79df11eb1f607bfb79";
const GEETEST_KEY = process.env.GEETEST_KEY || "dd62937bf28bdb969eeeeaa85efd58cf";

module.exports = {
    PORT,
    MONGO_URI,
    JWT_SECRET,
    JWT_EXPIRE,
    JWT_COOKIE_EXPIRE,
    NODE_ENV,
    SALT_ROUND,
    GEETEST_ID,
    GEETEST_KEY
};
