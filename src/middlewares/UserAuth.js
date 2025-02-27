const jwt = require('jsonwebtoken')
const User = require('../models/userModal')
const UserAuth = async (req,res,next) => {
    const {token} = req.cookies;
    
    if(!token){
        res.send('no token')
    }
    const {_id} = await jwt.verify(token,'Jaggu@143')
    try{
         if(!_id){
            throw new Error('Token is invalid')
         }
    const user = await User.findOne({_id})
    if(!user){
        throw new Error('user not found')
    }
    req.user = user;
        next()
    }
    catch(err){
        res.status(400).send('Invalid token')
    }

}

module.exports = UserAuth