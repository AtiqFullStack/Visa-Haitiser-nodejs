import jwt from 'jsonwebtoken'
import { JWT_EXPIRE, JWT_SECRET } from '../utils/cofig'

// In-memory token blacklist
const blacklistedTokens = new Set<string>()

export const generateToken = (payload: object, expiresIn: string = JWT_EXPIRE): string => {
    return jwt.sign(payload, JWT_SECRET as string, { expiresIn })
}

export const verifyToken = (token: string): any => {
    if (blacklistedTokens.has(token)) {
        throw new Error('Token has been blacklisted')
    }
    return jwt.verify(token, JWT_SECRET as string)
}

export const blacklistToken = (token: string): void => {
    blacklistedTokens.add(token)
}