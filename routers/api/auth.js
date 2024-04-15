import { Router } from "express";
import authr from "../../middleware/authr.js";
import User from '../../models/Users.js';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import config from 'config';
import jwt from 'jsonwebtoken';
const auth = Router();

//@route Get  api/auth
//@desc Test route
//@access public

auth.get('/',authr, async (req, res) => {
    try {
       const user = await User.findById(req.user.id).select('-password');
       res.json(user)
    } catch(err) {
       console.error(err.message);
       res.status(500).send('server error');
    }
   
   });

   /**
 * @route POST /api/auth
 * @desc Authenicate  user and get token 
 * @access Public
 */


auth.post('/',[
    
    check('email').isEmail().withMessage('Invalid email'),
    check('password').exists().withMessage('Password is required'),
], 
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email ,password} =req.body;

    try{
 //see if user exist
let user = await User.findOne({email});

if(!user) {
    res.status(400).json({err:[{msg: 'Invalied credintial'}]})
}

const isMatch = await bcrypt.compare(password , user.password);
if(!isMatch) {
    res.status(400).json({err:[{msg: 'Invalied credintial'}]})
}

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


export default auth;