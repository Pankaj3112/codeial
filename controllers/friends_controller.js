const User = require('../model/user');
const Friendship = require('../model/friendship');

module.exports.toggleFriend = async function(req, res){
    let to_userId = req.params.id;
    let from_userId = req.user._id;

    try{
        //if friendship already exists then delete it
        let friendship = await Friendship.findOne({
            from_user: from_userId,
            to_user: to_userId
        });

        let from_user = await User.findById(from_userId);
        let to_user = await User.findById(to_userId);

        if(friendship){
            from_user.friendships.pull(friendship._id);
            await from_user.save();

            to_user.friendships.pull(friendship._id);
            await to_user.save();

            await friendship.deleteOne();

            console.log('friendship removed');
        }
        else{
            let newFriendship = await Friendship.create({
                from_user: from_userId,
                to_user: to_userId
            });

            from_user.friendships.push(newFriendship._id);
            from_user.save();

            to_user.friendships.push(newFriendship._id);
            to_user.save();

            console.log(newFriendship);
        }

        return res.redirect('back');
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

