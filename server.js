const express = require('express');
const app = express();
app.use(express.json());

const dotenv=require('dotenv')
dotenv.config()
const {sequelize} = require('./models/index');

const ErrorCtrl=require('./controllers/ErrorController');
const appError=require('./utils/appError');
const UserRoutes=require('./routes/UserRoutes');
const PostRoutes=require('./routes/PostRoutes');

app.use('/api/User',UserRoutes);
app.use('/api/Post',PostRoutes);

app.all('*',(req,res,next)=>{
    next(new appError(`cant find this route: ${req.originalUrl} in this server!`,404));
});
app.use(ErrorCtrl);


const Port=process.env.PORT || 3000
app.listen(Port,()=>{
    sequelize.authenticate().then(()=>{
        console.log('CONNECTED TO THE DATABASE...');
    });
    console.log(`THE SERVER IS RUNNING ON PORT ${Port}...`);
});






