import mongoose, { Schema } from 'mongoose'
import type { IAdmin } from '../types'

    const adminSchema = new Schema<IAdmin>({
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        phone: {
            type: String,
        },
        name: {
            type: String,

        },
        emailOtp: {
            type: String
        },
        phoneOtp: {
            type: String
        }
    }, {
        timestamps: true
    })

export default mongoose.model<IAdmin>('Admin', adminSchema)