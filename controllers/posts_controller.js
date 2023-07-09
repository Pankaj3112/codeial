const Post = require('../model/post');

module.exports.create = function(req, res){
    Post.create({
        content: req.body.content,
        user: req.user._id
    })
    .then(function(post){
        console.log('Post created successfully --->', post);
        return res.redirect('back');
    })
    .catch(function(err){
        console.log('Error in creating post --->', err);
        return;
    })
}
