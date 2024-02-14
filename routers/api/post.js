import { Router } from "express";

const posts = Router();

//@route Get  api/post
//@desc Test route
//@access public

posts.get('/',(req,res) => res.send('posts route'));

export default posts;