const User = require('../model/user');
const path = require('path');
const fs = require('fs');

//Fetch veiws and render them
module.exports.profile = async function(req, res){
    try{
        let user = await User.findById(req.params.id);
    
        return res.render('user_profile', {
            title: 'Codeial | User Profile',
            profile_user : user
        })
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