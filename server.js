const express = require('express');
const dotenv=require('dotenv')
const http=require('http');
const app = express();
const server=http.createServer(app);
const socket=require('socket.io');
const io=new socket.Server(server);

app.use(express.json());
dotenv.config()

const {sequelize} = require('./models/index');
const ErrorCtrl=require('./controllers/ErrorController');
const appError=require('./utils/appError');
const UserRoutes=require('./routes/UserRoutes');
const PostRoutes=require('./routes/PostRoutes');
const CommentRoutes=require('./routes/CommentRoutes');
const LikeRoutes=require('./routes/LikeRoutes');
const MessageRoutes=require('./routes/MessageRoutes');

const ioAuth=require('./middlewares/ioAuth');
const UserEvents=require('./Events/UserEvens')
 const ioMiddleware = require('./middlewares/injectio');
app.use(ioMiddleware(io));

app.use('/api/User',UserRoutes);
app.use('/api/Post',PostRoutes);
app.use('/api/Comment',CommentRoutes);
app.use('/api/Like',LikeRoutes);    
app.use('/api/Message',MessageRoutes);    

app.all('*',(req,res,next)=>{
    next(new appError(`cant find this route: ${req.originalUrl} in this server!`,404));
});

app.use(ErrorCtrl);

const onConnection=async(socket)=>{
    UserEvents(io,socket);
}
io.use(ioAuth);
io.on('connection',onConnection)
const Port=process.env.PORT || 3000
server.listen(Port,()=>{
    sequelize.authenticate().then(()=>{
        console.log('CONNECTED TO THE DATABASE...');
    });
    console.log(`THE SERVER IS RUNNING ON PORT ${Port}...`);
});
