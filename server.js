import express from 'express';
import connectDB from './config/db.js';
const app = express();

//connect database
connectDB();

app.get('/' ,(req,res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;


app.listen(PORT , () => console.log(`server started on port ${PORT}`));
