const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: true,
        credentials: true,
        methos: ["GET", "POST"]
    }
});

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
    res.send({ "message": 'Welcome to server side from HomeHeal Socket.io' });
});

http.listen(3000, () => {
    console.log('server Listening on port 3000');
});