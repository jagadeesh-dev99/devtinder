const validator = require('validator');

const validateSignup = (body) => {
     const {firstName,lastName,age,email,password} = body;
     if(!firstName || !lastName){
        throw new Error('Please proived a valid name')
     }
      if(!validator.isEmail(email)){
        throw new Error('Please proived a valid email')
     }
      if(!validator.isStrongPassword(password)){
        throw new Error('Please enter valid password')
     }
        return true

}


module.exports = {
    validateSignup
}