const Posts = require('../model/post');
const User = require('../model/user');
const Friendship = require('../model/friendship');

module.exports.home = async function(req, res){
    
    try{
        let posts = await Posts.find({})

        //populating comments and friendships
        .populate('user')
        .sort('-createdAt')
        .populate({
            path: 'comments',
            options: { sort: { 'createdAt': -1 } },
            populate: {
                path: 'user'
            }
        });

        //all the users of app
        let users = await User.find({}); 
        
        let fships = [];
        if(req.user){
            //loggedIn user with all the friendships
            let user = await User.findById(req.user.id)
            .populate({
                path: 'friendships',
                populate: {
                    path: 'from_user to_user'
                }
            });

            fships = user.friendships;
        }
    
        return res.render('home', {
            title: "Home | Codeial",
            posts: posts,
            all_users: users,
            friendships: fships
        }); 
    }  
    catch(err){
        console.log('Error in fetching posts from db --->', err);
        return;
    }
};
