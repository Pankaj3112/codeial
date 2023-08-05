const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../model/user');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'codeial'
};


passport.use(new JWTStrategy(opts, async function(jwtPayLoad, done){

    try{
        let user = await User.findById(jwtPayLoad._id);

        if(user){
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    }
    catch(err){
        console.log('Error in finding user from JWT');
        return;
    }

}));

module.exports = passport;