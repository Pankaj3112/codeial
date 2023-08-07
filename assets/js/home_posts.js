
{
    // method to submit the form data for new post using AJAX
    let createPost = function () {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function (e) {
            e.preventDefault();
            
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function (data) {
                    let newPost = newPostDom( data.data.post, data.data.username);
                    $('#all-posts').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                    
                    //the comment form should be ajaax
                    let newCommentForm = document.querySelector(`#post-${data.data.post._id} .new-comment-form`);
                    newCommentForm.addEventListener("submit", function(e){
                        e.preventDefault();
                        newComment(newCommentForm);
                    });

                    //enable the functionality of the toggle like button on the new post
                    let btn = document.querySelector('#post-'+data.data.post._id+' .toggle-like-button');
                    btn.addEventListener("click", function(e){
                        e.preventDefault();
                        toggleLike(btn);
                    });

                    flash("Post Created!", 'success');
                },
                error: function (error) {
                    console.log(error.responseText);

                    flash("Something went wrong!", 'error');
                }
            });
        });
    }


    // method to create a post in DOM
    let newPostDom = function (post, username) {
        
        return $(
        `<div id="post-${post._id}">
            <hr>
            <h3>Post</h3>
            
            <div class="post">
            <!-- Content of the Post -->
            <div class="post-content">
                <p>${post.content}</p>
                <p> by ${username} </p>

                <!-- Like button -->
                <small>
                    <a class="toggle-like-button post-like" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                        0 Likes
                    </a>
                </small>
                &nbsp

                <!-- delete post button -->
                <small>
                    <a class="delete-post-button" href="/posts/destroy/${post._id}">Delete Post</a>
                </small>
            </div>
            
                
                <!-- Comment Section -->
                <div class="post-comments">
                    <h3>Comments</h3>
                    
                    <form action="/comments/create" class="new-comment-form" method="POST">
                        <input type="text" name="content" placeholder="Type here to add comment..." required>
                        <input type="hidden" name="post" value="${post._id}">
                        <input type="submit" value="Add Comment">
                    </form>

                    <div class="post-comments-list">
                        <ul id="post-comments-${post._id}">
                            
                        </ul>
                    </div>
                </div>
            </div>
        </div>`)
    }


    //method to delete a post from DOM
    let deletePost = function (deleteLink) {
        $(deleteLink).click(async function (e) {
            e.preventDefault();

            // $.ajax({
            //     type: 'get',
            //     url: $(deleteLink).prop('href'),
            //     success: function (data) {
            //         $(`#post-${data.data.post_id}`).remove();
            //         flash("Post Deleted!", 'success');
            //     },
            //     error: function (error) {
            //         console.log(error.responseText);
            //         flash("Something went wrong!", 'error');
            //     }
            // });
            
            //Fetch API way of deleting a post
            //which one is better?
            //https://stackoverflow.com/questions/5004233/jquery-ajax-post-vs-axios-post-vs-fetch
            try{
                let data = await fetch($(deleteLink).prop('href'));
                data = await data.json();
                $(`#post-${data.data.post_id}`).remove();
                flash("Post Deleted!", 'success');
            }
            catch(err){
                console.log(err);
                flash("Something went wrong!", 'error');
            }

        });
    }


    //add ajax deletion to all existing posts
    let convertPostsToAjax = function () {
        $('#all-posts > div').each(function () {
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);
        });
    }


    //method to show notification using noty
    let flash = function (message, type) {
        new Noty({
            theme: 'relax',
            text: message,
            type: type,
            layout: 'topRight',
            timeout: 1500
        }).show();
    }

    
    //method to submit the form data for new comment using AJAX
    let createComment = function () {
        let newCommentForm = $('.new-comment-form');
        newCommentForm.each(function(){
            $(this).submit(function (e) {
                e.preventDefault();
                newComment(this);
            });
        });
    }

    let newComment = function (newCommentForm) {
        $.ajax({
            type: 'post',
            url: '/comments/create',
            data: $(newCommentForm).serialize(),
            success: function (data) {
                let newComment = newCommentDom(data.data.comment, data.data.username);
                $(`#post-comments-${data.data.comment.post}`).prepend(newComment);
                deleteComment($(' .delete-comment-button', newComment));

                //enable the functionality of the toggle like button on the new post
                let btn = document.querySelector('#comment-'+data.data.comment._id+' .toggle-like-button');
                btn.addEventListener("click", function(e){
                    e.preventDefault();
                    toggleLike(btn);
                });

                flash("Comment Created!", 'success');
            },
            error: function (error) {
                console.log(error.responseText);
            }
        });
    }


    // method to create a comment in DOM
    let newCommentDom = function (comment, username) {
        return $(
            `<li id= "comment-${comment._id}"
                <p>${comment.content}</p>
                <small>by ${username} </small> 
                
                <br>
                <!-- Like button -->
                <small>
                    <a class="toggle-like-button comment-like" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                        0 Likes
                    </a>
                </small>
                &nbsp
                
                <!-- Delete comment button -->
                <small>
                    <a class="delete-comment-button" href="/comments/destroy/${comment._id}">Delete Comment</a>
                </small>
            </li>
        `)
    }


    //method to delete a comment from DOM
    let deleteComment = function (deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`#comment-${data.data.comment_id}`).remove();
                    flash("Comment Deleted!", 'success');
                },
                error: function (error) {
                    console.log(error.responseText);
                    flash("Something went wrong!", 'error');
                }
            });
        });
    }


    //add ajax deletion to all existing comments
    let convertCommentsToAjax = function () {
        $('.post-comments-list > ul > li').each(function () {
            let self = $(this);
            let deleteButton = $(' .delete-comment-button', self);
            deleteComment(deleteButton);
        });
    }




    // Likes

    //convert likeLinks to ajax
    let convertLikesToAjax = function(){
        let toggleLikebtn = document.querySelectorAll('.toggle-like-button');
        toggleLikebtn.forEach((btn)=>{
            btn.addEventListener('click', function(e){
                e.preventDefault();
                toggleLike(btn);
            });
        })
    }

    let toggleLike = async function(btn){
        let data = await fetch(btn.href);
        data = await data.json();
        let likeCount = btn.dataset.likes;
        likeCount = data.data.deleted? --likeCount : ++likeCount;
        btn.innerHTML = `${likeCount} Likes`;
        btn.dataset.likes = likeCount;

        let type = btn.classList.contains('post-like')? 'Post' : 'Comment';
        let msg = data.data.deleted? `Disliked Successfully!` : `Liked Successfully!`;
        
        flash(`${type} ${msg}`, 'success');
    }



    convertPostsToAjax();
    createPost();
    convertCommentsToAjax();
    createComment();
    convertLikesToAjax();
}