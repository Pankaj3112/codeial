const Comment = require('../model/comment');
const Post = require('../model/post');
const User = require('../model/user');
const commentsMailer = require('../mailers/comment_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');

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

            comment = await comment.populate('user', 'name email');
            
            //sending an  email by kue worker
            // commentsMailer.newComment(comment);
            let job = queue.create('emails', comment)
            .save(function(err){
                if(err){
                    console.log('Error in sending to the queue', err);
                    return;
                }
                console.log('Job enqueued', job.id);
            });

            
            if(req.xhr){
                let user = await User.findById(req.user.id);

                return res.status(200).json({
                    data: {
                        comment: comment,
                        username: user.name
                    },
                    message: "Comment Created!"
                });
            }

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

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment Deleted!"
                });
            }

            res.redirect('back');
        }
    }
    catch(err){
        console.log('Error in deleting comment', err);
    }

}