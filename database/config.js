const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODBCNN);

        console.log('Base de datos online');
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    dbConnection
};