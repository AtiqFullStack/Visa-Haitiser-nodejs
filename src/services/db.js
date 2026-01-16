const mongoose = require('mongoose');
const { MONGO_URI } = require('../utils/cofig');

const dbConnect = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("DB Online and connected");
    } catch (error) {
        console.log(error);
        throw new Error("Error al inicializar la base de datos");
    }
};

module.exports = { dbConnect };
