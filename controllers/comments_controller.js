const Comments = require('../model/comment');
const Post = require('../model/post');

module.exports.create = function(req, res){
    Post.findById(req.body.post)
    .then((post) => {
        if(post){
            Comments.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            })
            .then((comment) => {
                post.comments.push(comment);
                post.save();
                console.log('Comment created -->', comment);
                res.redirect('back');
            })
            .catch((err) => {
                console.log('Error in creating comment -->', err);
                return;
            })
        }
    })
    .catch((err) => {
        console.log('Error in finding post -->', err);
        return;
    })
}