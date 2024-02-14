import config from 'config';
import jwt from 'jsonwebtoken';

export default function(req, res, next) {
    // Get token frome header

    const token = req.header('x-auth-token');

    //check if not token
    if(!token) {
        return res.status(401).json({msg:'no token,autorization denied'})
    }
    //verify token
    try {
        const decoded = jwt.verify(token ,config.get('jwtSecret'));
        req.user =decoded.user;
        next();
    } catch(err) {
        res.status(401).json({msg:'Token is not valied'})
    }
  }