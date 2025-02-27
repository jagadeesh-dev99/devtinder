const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:String
    }
},{timestamps:true})


userSchema.methods.validatePassword = async function(inputPassword){
    const match = await bcrypt.compare(inputPassword, this.password);
    return match
}

module.exports = mongoose.model('User',userSchema);
