const Posts = require('../../../model/post');
const User = require('../../../model/user');
const Comment = require('../../../model/comment');

module.exports.index = async function(req, res){
    try{
        let posts = await Posts.find({})
        .populate('user')
        .sort('-createdAt')
        .populate({
            path: 'comments',
            options: { sort: { 'createdAt': -1 } },
            populate: {
                path: 'user'
            }
        });

        let users = await User.find({});
            
        return res.status(200).json({
            message: 'Lists of posts',
            posts: posts,
            all_users: users
        })
    }  
    catch(err){
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}



module.exports.destroy = async function(req, res){
    try{
        let post = await Posts.findById(req.params.id);
        
        if(post.user == req.user.id){
            await post.deleteOne();
            await Comment.deleteMany({post: req.params.id});
        
            return res.status(200).json({
                data: {
                    post_id: req.params.id
                },
                message: "Post Deleted!"
            });
        }
        else{
            return res.status(401).json({
                message: 'You cannot delete this post!'
            })
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
