const Posts = require('../model/post');

module.exports.home = function(req, res){
    Posts.find({})
    .populate('user')
    .then(function(posts){
        return res.render('home', {
            title: "Home | Codeial",
            posts: posts
        });
    })
    .catch(function(err){
        console.log('Error in fetching posts from db --->', err);
        return;
    })
};

