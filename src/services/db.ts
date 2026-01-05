import mongoose from "mongoose";
import { MONGO_URI } from "../utils/cofig";

const dbConnect = async () => {
    try {
        await mongoose.connect(MONGO_URI as string);
        console.log("DB Online and connected");
    } catch (error) {
        console.log(error);
        throw new Error("Error al inicializar la base de datos");
    }
}



export { dbConnect };