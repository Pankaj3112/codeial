const Posts = require('../model/post');
const User = require('../model/user');

module.exports.home = function(req, res){
    Posts.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .then(function(posts){

        User.find({})
        .then((users) => {
            return res.render('home', {
                title: "Home | Codeial",
                posts: posts,
                all_users: users,
            });
        })
        
    })
    .catch(function(err){
        console.log('Error in fetching posts from db --->', err);
        return;
    })
};

