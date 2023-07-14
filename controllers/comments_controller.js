const Comment = require('../model/comment');
const Post = require('../model/post');

module.exports.create = function(req, res){
    Post.findById(req.body.post)
    .then((post) => {
        if(post){
            Comment.create({
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


module.exports.destroy = function(req, res){
    Comment.findById(req.params.id)
    .then((comment) =>{
        if(comment.user == req.user.id){
            let postId = comment.post;
            comment.deleteOne();
            
            //Pull Syntax Not Working 
            // Post.findByIdAndUpdate(postId, {
            //     $pull: {comments :{_id : req.params.id}}
            // })
            // .then((comment)=>{
            //     console.log("comment deleted ---------->", comment);
            // })
            // .catch((err)=>{
            //     console.log("error---->", err)
            // })

            Post.findById(postId)
            .then((post) => {
                post.comments.splice(post.comments.indexOf(req.params.id) , 1)
                post.save();
            })

        }
    })
    .catch((err) =>{
        console.log('Error in deleting comment', err);
    })

    res.redirect('back');
}