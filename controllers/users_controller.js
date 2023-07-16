const User = require('../model/user');

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
    try{
        if(req.user.id == req.params.id){
            let user = await User.findByIdAndUpdate(req.user.id,
                req.body
            );
            
            return res.redirect('back');
        }
        else{
            return res.status(401).send('Unauthorized');
        }
    }   
    catch(err){
        console.log("Error in updating the user info----->", err);
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