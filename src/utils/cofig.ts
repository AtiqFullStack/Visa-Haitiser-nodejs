export const PORT =  process.env.PORT || 5001
export const MONGO_URI =  process.env.MONGO_URI || "mongodb://localhost:27017/qr-generator"

export const JWT_SECRET = process.env.JWT_SECRET || "secret"
export const JWT_EXPIRE = process.env.JWT_EXPIRE || "30d"

export const JWT_COOKIE_EXPIRE = process.env.JWT_COOKIE_EXPIRE || 30

export const NODE_ENV = process.env.NODE_ENV || "development"

export const SALT_ROUND = process.env.SALT_ROUND || 15