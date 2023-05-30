import  express  from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
});


app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Whatsapp!!'
    })
})

io.on('connection', (socket) => {
    console.log('A user connected!', socket.id);

    socket.on('join-room', (data) => {
        socket.join(data);
    })
    
    socket.on('create-message', (data, room) => {
        console.log(data, room);
        // socket.broadcast.emit('recieve-message', data);
        socket.to(room).emit('recieve-message', data);
    })


    socket.on('disconnect', () => {
        console.log('User disconnected!')
    })
})




server.listen(8000, () => {
    console.log('Server started on port', 8000);
})