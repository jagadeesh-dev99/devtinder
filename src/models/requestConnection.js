const mongoose = require('mongoose');
const {Schema} = mongoose;

const requestConnection = new Schema({
     fromUserId:{
        type:Schema.Types.ObjectId,
        ref:'User'
     },
     toUserId:{
        type:Schema.Types.ObjectId,
     },
     status:{
        type:String,
        enum:{
            values    :['interested','ignored','accepted','rejected'],
            message: '{VALUE} is not supported'
        }
        
     }
})


module.exports = mongoose.model('requestConnection',requestConnection)