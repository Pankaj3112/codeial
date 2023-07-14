const Post = require('../model/post');
const Comment = require('../model/comment')

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


module.exports.destroy = function(req, res){

    Post.findById(req.params.id)
    .then((post)=>{
        if(post.user == req.user.id){
            post.deleteOne();
            Comment.deleteMany({post: req.params.id});
        }
        else{
            console.log("Not Authorized to Delete this post");
        }
    })
    .catch((err)=>{
        console.log("Error in finding post ----->", err);
    })

    return res.redirect('back');
}
