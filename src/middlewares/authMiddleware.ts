import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../helper'
import { ApiError } from '../utils'

interface AuthRequest extends Request {
    user?: any
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
        throw new ApiError(401, 'Access token required')
    }
    
    try {
        const decoded = verifyToken(token)
        req.user = decoded
        next()
    } catch (error) {
        throw new ApiError(401, 'Invalid token')
    }
}

export default authMiddleware