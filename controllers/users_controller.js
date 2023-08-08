const User = require('../model/user');
const Friendship = require('../model/friendship');
const ResetPasswordToken = require('../model/reset_password_token');
const resetPasswordMailer = require('../mailers/reset_password_mailer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

//Fetch veiws and render them
module.exports.profile = async function(req, res){
    try{
        let to_user = await User.findById(req.params.id);
        to_user.isFriend = false;

        //check if friendship already exists or not
        let toId = to_user._id;
        let fromId = req.user._id;

        let f1 = await Friendship.findOne({
            from_user: fromId,
            to_user: toId
        });

        let f2 = await Friendship.findOne({
            from_user: toId,
            to_user: fromId
        });
        
        if(f1 || f2){
            to_user.isFriend = true;
        };

        return res.render('user_profile', {
            title: 'Codeial | User Profile',
            profile_user : to_user,
        });
    }
    catch(err){
        console.log("Can not fetch user profile", err);
    }
}


module.exports.update = async function(req, res){
    
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log('Multer Error', err);
                }
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file){

                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                    //this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }

        catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    }
    else{
        req.flash('error', 'Unauthorized');
        return res.status(401).send('Unauthorized');
    }
}


module.exports.signUp = function(req, res){
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_signup', {
        title: "Codeial | Sign Up"
    });
}


module.exports.signIn = function(req, res){
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    
    return res.render('user_signin', {
        title: "Codeial | Sign In"
    });
}


//Get the sign up data
module.exports.create = async function(req, res){
    //if password and confirm password are not same then redirect back
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    try{
        //if password and confirm password are same then check if user already exists
        let user = await User.findOne({email: req.body.email});
    
        //if user does not exist then create user
        if(!user){
            await User.create(req.body);
            return res.redirect('/users/sign-in');
        }
        else{
            res.redirect('back');
        }
    }
    catch(err){
        console.log('Error something went wrong', err);
    };
}

//Get the sign in data
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout(function(err) {
        req.flash('error', "Something went wrong");
    });
    
    req.flash('success', 'You are logged out');
    return res.redirect('/');
}


//Reset Password

//when user clicks on forgot pw a page opens
module.exports.forgotPassword = function(req, res){
    return res.render('forgot_password', {
        title: "Codeial | Forgot Password"
    });
}

//user writes his email and email with resetlink is sent to his email
module.exports.forgotPasswordPost = async function(req, res){
    let email = req.body.email;

    let user = await User.findOne({email: email});
    if(user){
        let token = await ResetPasswordToken.create({
            user: user.id,
            accessToken: crypto.randomBytes(20).toString('hex'),
            isValid: true
        });

        token = await token.populate('user', 'name email');
        resetPasswordMailer.newResetPassword(token);
        req.flash('success', 'Reset Password Link has been sent to your email');
        return res.redirect('/users/sign-in');
    }
    else{
        req.flash('error', 'User with this email does not exist');
        return res.redirect('back');
    }
}

//when user clicks on reset password link in his email a new page opens
module.exports.resetPassword = function(req, res){
    return res.render('reset_password', {
        title: "Codeial | Reset Password",
        token: req.query.token
    });
}

//user enters new password and confirm password and clicks on submit
module.exports.resetPasswordPost = async function(req, res){
    let password = req.body.password;
    let confirmPassword = req.body.confirm_password;

    if(password != confirmPassword){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }
    
    try {
        let token = await ResetPasswordToken.findOne({accessToken: req.query.token});
        if(token && token.isValid){
            let user = await User.findById(token.user);
            user.password = password;
            user.save();
            await token.deleteOne();

            req.flash('success', 'Password has been changed successfully');
            return res.redirect('/users/sign-in');
        }
        else{
            req.flash('error', 'Link has expired');
            return res.redirect('/users/forgot-password');
        }
    } 
    catch(err){
        console.log('Error in reset password', err);
        return res.redirect('back');
    }
}



