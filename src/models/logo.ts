import { Schema, model } from "mongoose";
import type { Logos } from "../types/Admin";


const logoShema = new Schema({
    url: String,
    public_id: String,
    name: String,
    dimensions: {
        width: Number,
        height: Number
    },


}, {
    timestamps: true
})

export default model<Logos>('logo', logoShema)