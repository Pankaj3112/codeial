const Post = require('../model/post');
const Comment = require('../model/comment');
const User = require('../model/user');

module.exports.create = async function(req, res){
    try{
        let user = await User.findById(req.user.id);

        let post = await Post.create({
            content: req.body.content,
            user: req.user.id
        });

        
        if(req.xhr){
            return res.status(200).json({
                data: {
                    post: post,
                    username: user.name
                },
                message: "Post Created!"
            });
        }
        
        req.flash('success', 'Post Published!');
        console.log('Post created successfully --->', post);
        return res.redirect('back');
    }
    catch(err){
        req.flash('error', err);
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
            
            
            // if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post Deleted!"
                });
            // }
            
            req.flash('success', 'Post and associated comments deleted!');
        }
        else{
            console.log("Not Authorized to Delete this post");
        }
        return res.redirect('back');
    }
    catch(err){
        req.flash('error', err);
        console.log("Error in finding post ----->", err);
    }
}
