const Post = require('../model/post');
const Comment = require('../model/comment')

module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        console.log('Post created successfully --->', post);
        return res.redirect('back');
    }
    catch(err){
        console.log('Error in creating post --->', err);
        return;
    }
}


module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id){
            await post.deleteOne();
            await Comment.deleteMany({post: req.params.id});
        }
        else{
            console.log("Not Authorized to Delete this post");
        }
        return res.redirect('back');
    }
    catch(err){
        console.log("Error in finding post ----->", err);
    }
}
