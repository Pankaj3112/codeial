const User = require('../model/user');

//Fetch veiws and render them
module.exports.signUp = function(req, res){
    return res.render('user_signup', {
        title: "Codeial | Sign Up"
    });
}


module.exports.signIn = function(req, res){
    console.log(req.cookie);
    res.cookie('user_id', 25);
    return res.render('user_signin', {
        title: "Codeial | Sign In"
    });
}


//Get the sign up data
module.exports.create = function(req, res){
    //if password and confirm password are not same then redirect back
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    //if password and confirm password are same then check if user already exists
    User.findOne({email: req.body.email})
    .then(function(user){
        //if user does not exist then create user
        if(!user){
            User.create(req.body)
            .then(function(user){
                return res.redirect('/users/sign-in');
            })
            .catch(function(err){
                console.log('Error in creating user while signing up', err);
                return;
            })
        }
        else{
            res.redirect('back');
        }
    })
    .catch((err) => console.log('Error something went wrong', err));
}

//Get the sign in data
module.exports.createSession = function(req, res){
    //TODO later
    abcd
}