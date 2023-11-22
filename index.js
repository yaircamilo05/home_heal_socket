const { Socket } = require('socket.io');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').Server(app);
const sql = require('mssql');
const databaseConfig = require('./databaseConfig');
app.use(express.json());

const corsOptions = {
    origin: process.env.CLIENT_URL, 
    optionsSuccessStatus: 200 // Algunos navegadores antiguos (IE11, varios SmartTVs) pueden interpretar erróneamente 204
  };

app.use(cors(corsOptions));


const io = require('socket.io')(http, {
    cors: {
        origin: true,
        credentials: true,
        methos: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 5000;

function conectarBaseDeDatos() {
    try {
        sql.connect(databaseConfig);
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}
conectarBaseDeDatos();


updateVitalSigns = async (data) => {
    try {
        const {hearth_rate, blood_pressure, O2_saturation, patient_id} = data;
        const pool = await sql.connect(databaseConfig);
        if(pool.connected) {
            console.log('A ACTUALIZAR', data)
            await pool.query
            (   `UPDATE vital_signs 
                 SET hearth_rate = ${hearth_rate}, 
                 blood_pressure = ${blood_pressure}, 
                 O2_saturation = ${O2_saturation} 
                 WHERE patient_id = ${patient_id}`
            );
            const result = await pool.query
            (   `SELECT TOP 1 *
                 FROM vital_sign_records VSR
                 WHERE VSR.patient_id = ${patient_id}
                 ORDER BY  VSR.date DESC`
            );
            return result.recordset[0];
        }
    } catch (error) {
        console.error('Error al obtener datos de la base de datos:', error);
    }
}


io.on('connection', (socket) => {
    
    console.log('a user connected');

    socket.on('welcome', () => {
        socket.emit('welcome', { "HI!": socket.id });
    });

    socket.on('update vital Signs', async (data) => {
        result = await updateVitalSigns(data);
        io.emit('update vital Signs', result);
    });

    socket.on('privateMessage', (data) => {
        socket.broadcast.emit('privateMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});

app.get('/', (req, res) => {
    res.send("<h1>Bienvenido a el servidor de socket de HomeHeal</h1>");
});

http.listen(PORT, () => {
    console.log(`server Listening on port ${PORT}`);
});