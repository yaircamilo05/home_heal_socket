require('dotenv').config();

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: true, // Dependiendo de la configuración de tu base de datos
        enableArithAbort: true // Dependiendo de la configuración de tu base de datos
    }
};

module.exports = config;