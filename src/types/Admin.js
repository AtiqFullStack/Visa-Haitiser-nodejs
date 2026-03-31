const { Document } = require('mongoose')

export interface IAdmin extends Document {
    email: string
    password: string
    phone: string
    name: string
    emailOtp?: string
    phoneOtp?: string
}


export interface Logos extends Document {
    url,
    public_id?: String,
    name?: String,
    dimensions?: {
        width,
        height: Number
    },
}