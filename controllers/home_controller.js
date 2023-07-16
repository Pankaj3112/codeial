const Posts = require('../model/post');
const User = require('../model/user');

module.exports.home = async function(req, res){
    
    try{
        let posts = await Posts.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });

        let users = await User.find({})
            
        return res.render('home', {
            title: "Home | Codeial",
            posts: posts,
            all_users: users,
        }); 
    }  
    catch(err){
        console.log('Error in fetching posts from db --->', err);
        return;
    }
};

