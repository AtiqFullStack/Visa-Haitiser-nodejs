import { Document } from 'mongoose'

export interface IAdmin extends Document {
    email: string
    password: string
    phone: string
    name: string
    emailOtp?: string
    phoneOtp?: string
}