import express from 'express';
import connectDB from './config/db.js';
import router from './routers/api/users.js';
import profile from './routers/api/profile.js';
import auth from './routers/api/auth.js';
import posts from './routers/api/post.js';
const app = express();

//connect database
connectDB();

//Init Middlware
app.use(express.json({extended: false}));

app.get('/' ,(req,res) => res.send('API Running'));


//Define Routers
app.use('/api/users' , router);
app.use('/api/auth' , auth);
app.use('/api/profile' , profile);
app.use('/api/posts' , posts);



const PORT = process.env.PORT || 5000;


app.listen(PORT , () => console.log(`server started on port ${PORT}`));
