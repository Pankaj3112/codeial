const Posts = require('../model/post');
const User = require('../model/user');

module.exports.home = async function(req, res){
    
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

