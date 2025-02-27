const express = require('express');
const {validateSignup} = require('../utils')
const bcrypt = require('bcrypt');
const User = require('../models/userModal')
const jwt = require('jsonwebtoken')
const UserAuth = require('../middlewares/UserAuth')
const authRouter = express.Router();

authRouter.post('/signup',async (req,res) => {
    const {firstName,lastName,age,password,email} = req.body;
    try{
        validateSignup(req.body);
        const hashPassword = await bcrypt.hash(password,10)
        const newUser = new User({
            firstName,lastName,age,email,password:hashPassword
        })
        await newUser.save()
        
        res.status(201).send('successfully registsered')

    }
    catch(err){
        res.status(400).send(`${err.message}`)
    }
})

authRouter.post('/login',async(req,res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email})
    if(!user){
        throw new Error('User not found')
    }
   
    try{
        
        const isPasswordValid =await user.validatePassword(password)
        console.log(isPasswordValid,user,'======')
        const token = await jwt.sign({_id:user._id},'Jaggu@143')
        
        if(!isPasswordValid){
            throw new Error('Password wrong')       
        }
        res.cookie('token',token)
        
        res.send('login succesfull....')

    }
    catch(err){
        res.status(400).send('Invalid credentials')
    }
})

authRouter.get('/logout',UserAuth,(req,res) =>{
    res.clearCookie('token');
    res.send('logout successfully');
})
authRouter.patch('/profile/edit',UserAuth,async (req,res) => {
      const body = req.body;
      const allowed = ['firstName','lastName','age']
      const filter = {}
     Object.keys(body).forEach((each) => 
        
        {
            if(allowed.includes(each)){
                filter[each] = body[each]
            }

        }

       )
    console.log(filter)
     await User.findOneAndUpdate({_id : req.user._id},{$set:filter})
     res.send('success')
})

authRouter.patch('/profile/changePassword',UserAuth,async (req,res) => {
    const {password,_id} = req.body;
    try{
        if(!password){
            throw new Error('Invalid password')
        }
        const hashPassword = await bcrypt.hash(password,10)
        await User.findOneAndUpdate({_id},{$set:{password:hashPassword}})
        res.send('password updated')
    }
  catch(err){
    res.status(400).send('invalid password')
  }
     
})

module.exports = authRouter