const Comment = require('../model/comment');
const Post = require('../model/post');

module.exports.create = async function(req, res){

    try{
        let post = await Post.findById(req.body.post);

        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            
            post.comments.push(comment);
            post.save();
            console.log('Comment created -->', comment);
            return res.redirect('back');
        }
    }
    catch(err){
        console.log('Error in creating comment -->', err);
        return;
    }
}


module.exports.destroy = async function(req, res){
    
    try{
        let comment = await Comment.findById(req.params.id);

        if(comment.user == req.user.id){
            let postId = comment.post;
            await comment.deleteOne();

            let post = await Post.findById(postId)
            post.comments.splice(post.comments.indexOf(req.params.id) , 1)
            await post.save();

            res.redirect('back');
        }
    }
    catch(err){
        console.log('Error in deleting comment', err);
    }

}