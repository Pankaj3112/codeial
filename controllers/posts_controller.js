const Post = require('../model/post');
const Comment = require('../model/comment');
const User = require('../model/user');
const Like = require('../model/like');

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
            //delete likes on post
            await Like.deleteMany({likeable: post, onModel: 'Post'});

            //delete likes on comments of post

            // await Like.deleteMany({_id : {$in: post.comments}}); //this is not working
            let comments = await Comment.find({post: req.params.id});
            comments.forEach(async function(comment){
                await Like.deleteMany({likeable: comment, onModel: 'Comment'});
            });

            //delete the post
            await post.deleteOne();

            // delete comments of post
            await Comment.deleteMany({post: req.params.id});
                        
            return res.status(200).json({
                data: {
                    post_id: req.params.id
                },
                message: "Post Deleted!"
            });            
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
