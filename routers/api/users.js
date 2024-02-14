import { Router } from "express";
import { check, validationResult } from 'express-validator';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import config from 'config';
import jwt from 'jsonwebtoken';
import User from '../../models/Users.js';
const router = Router();

//@route Post  api/users
//@desc Register user
//@access public

router.post('/',[
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Invalid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 8 characters'),
],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {name , email ,password} =req.body;

    try{
 //see if user exist
let user = await User.findOne({email});

if(user) {
    return res.status(400).json({err:[{msg: 'user already exists'}]})
}
//Get users gravator

const avatar = gravatar.url(email, {
    s:'200',
    r:'pg',
    d:'mm'
});

user =  new User({
    name,
    email,
    avatar,
    password
});
//Encrypt password
const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(password ,salt);

await user.save();  //user register here


//Return jsonwebtoken
const payload = {
    user: {
        id: user.id
    }
}

 jwt.sign(payload, 
    config.get('jwtSecret'),
        {expiresIn:360000},
        (err,token)=> {
            if(err) throw err;
            res.json({token});
        }
    );
    } catch(err){
        console.error(err.message);
        res.status(500).send('server error')

    }


    
})

export default router;