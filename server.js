import express from 'express';
import connectDB from './config/db.js';
import router from './routers/api/users.js';
import profile from './routers/api/profile.js';
import auth from './routers/api/auth.js';
import posts from './routers/api/post.js';
import cors from 'cors'
const app = express();

//connect database
connectDB();

//Init Middlware
app.use(express.json({extended: false}));
app.use(cors({
    origin: 'http://localhost:8000' // Allow requests from frontend origin
  }));
app.get('/' ,cors(),(req,res) => res.send('API Running'));


//Define Routers
app.use('/api/users' ,cors(), router);
app.use('/api/auth' , auth);
app.use('/api/profile' ,cors(), profile);
app.use('/api/posts' ,cors(), posts);



//const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT || 3000

app.listen(PORT , () => console.log(`server started on port ${PORT}`));
