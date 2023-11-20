const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: true,
        credentials: true,
        methos: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {

    console.log('user connected', socket.id);

    socket.on('connetedListener', () => {
        socket.emit('connetedListener', {"Estas conectado al socket tu ID es: ": socket.id});
    });

    socket.on('sendmessage', (message) => {
        socket.broadcast.emit('recivedmessage', message);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });

});


app.get('/', (req, res) => {
    res.send("<h1>Bienvenido a el servidor de socket de HomeHeal</h1>");
});

http.listen(PORT, () => {
    console.log(`server Listening on port ${PORT}`);
});