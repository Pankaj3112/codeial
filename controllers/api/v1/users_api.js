const passport = require('passport');
const User = require('../../../model/user');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');

module.exports.createSession = async function(req, res){
   try{
        let user = await User.findOne({email: req.body.email}).select('+password');
        
        if(!user || user.password != req.body.password){
            return res.status(422).json({
                message: "Invalid username or password"
            });
        }

        
        return res.status(200).json({
            message: "Sign in successful, here is your token, please keep it safe!",
            data: {
                token: jwt.sign(user.toJSON(), env.jwt_key , {expiresIn: '1000000'})
            }
        });   
   } 
   catch(err){
        console.log('*******', err);
        res.status(500).json({
            message: "Internal Server Error"
        });
   }
}
