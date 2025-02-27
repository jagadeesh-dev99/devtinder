const express = require('express');
const UserAuth = require('../middlewares/UserAuth');
const mongoose = require('mongoose')
const User = require('../models/userModal')
const requestConnection = require('../models/requestConnection')
const connectionRouter  = express.Router();

connectionRouter.post('/requestConnection/:status/:toUserId',UserAuth, async (req,res) => {
      const {status,toUserId} = req.params;
      const {_id} = req.user;
      const allowedStatus = ['interested','ignored']
      if(!allowedStatus.includes(status)){
           return res.status(400).send('status not valid')
      }
      if(!mongoose.Types.ObjectId.isValid(toUserId)){
        return res.status(400).send('user id not valid')

      }
     const user = await User.findById(toUserId)
     if(!user){
        return res.send('user not found')
     }
     try{
        const isDup = await requestConnection.findOne({
            $or:[{
                fromUserId:_id,
                toUserId
            },{
                fromUserId:toUserId,
                toUserId:_id
            }]
        })
        if(isDup){
            return res.send('connection already made')
        }
        const newConnection =  new requestConnection({
            fromUserId:_id,
            toUserId,
            status
        })
       await newConnection.save()
        res.send('succesdd')


     }
     catch(err){
       res.send(`${err.message}`)
     }


})

connectionRouter.post('/reviewConnection/:status/:requestId',UserAuth,async (req,res) => {
    const {status,requestId} = req.params;
    const {_id} = req.user;
    console.log(req.user , 'user')
    const allowedStatus = ['accepted','rejected'];
    if(!allowedStatus.includes(status)){
        return res.send('status is not valid')
    }
    if(!mongoose.Types.ObjectId.isValid(requestId)){
        return res.send('not a valid user id')
    }

    try{
         const reviewrequest =await requestConnection.findOne({
            fromUserId:requestId,
            toUserId:_id,
            status:'interested'
         })
         console.log(reviewrequest,'-=-==--==')
         reviewrequest.status=status;
         await reviewrequest.save()

         res.send('success')

    }
    catch(err){
        return res.send(`${err.message}`)
    }
})

module.exports = connectionRouter