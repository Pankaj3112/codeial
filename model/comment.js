const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type : String,
        required : true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },

    // include the array of ids of all likes in this post schema itself
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
},
{timestamps: true});


const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;