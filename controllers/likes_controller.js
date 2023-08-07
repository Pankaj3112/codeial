const Post = require('../model/post');
const Comment = require('../model/comment');
const User = require('../model/user');
const Like = require('../model/like');


//toggle like when user clicks on like button
module.exports.toggleLike = async function(req, res){
    try {
        let type = req.query.type;
        let id = req.query.id;
        let deleted = false;

        let likeable;
        if(type == 'Post'){
            likeable = await Post.findById(id);
        }
        else{
            likeable = await Comment.findById(id);
        }
        
        let like = await Like.findOne({
            likeable: id,
            onModel: type,
            user: req.user._id
        });


        if(like){
            //delete like
            await like.deleteOne();

            //pull like id from comment or post likes array
            await likeable.likes.pull(like._id);
            await likeable.save();

            deleted = true;

            // res.redirect('back');

            // console.log("****like removed", likeable);

            return res.status(200).json({
                message: "Request Successful",
                data: {
                    deleted: deleted,
                }
            });
        }
        else{
            //make a new like
            let newLike = await Like.create({
                user: req.user._id,
                likeable: id,
                onModel: type
            });

            //push like id into comment or post likes array
            likeable.likes.push(newLike._id);
            await likeable.save();
            
            // res.redirect('back');
            
            // console.log("****like added", likeable);
            // console.log(likeable.likes.length);

            return res.status(200).json({
                message: "Request Successful",
                data: {
                    deleted: deleted,
                }
            });

        }
    } 
    catch(err) {
        console.log("****error in toggleLike in likescontroller",err);
        // res.redirect('back');
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
