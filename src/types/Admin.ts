import { Document } from 'mongoose'

export interface IAdmin extends Document {
    email: string
    password: string
    phone: string
    name: string
    emailOtp?: string
    phoneOtp?: string
}


export interface Logos extends Document {
    url: String,
    public_id?: String,
    name?: String,
    dimensions?: {
        width: Number,
        height: Number
    },
}