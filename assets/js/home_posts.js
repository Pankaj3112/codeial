
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

            <!-- delete post button -->
        
            <small>
                <a class="delete-post-button" href="/posts/destroy/${post._id}">Delete Post</a>
            </small>
            

            <div class="post">
                <!-- Content of the Post -->
                <div class="post-content">
                    <p>${post.content}</p>
                    <small> by ${username} </small>
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

                $.ajax({
                    type: 'post',
                    url: '/comments/create',
                    data: $(this).serialize(),
                    success: function (data) {
                        let newComment = newCommentDom(data.data.comment, data.data.username);
                        $(`#post-comments-${data.data.comment.post}`).prepend(newComment);
                        deleteComment($(' .delete-comment-button', newComment));
                        flash("Comment Created!", 'success');
                    },
                    error: function (error) {
                        console.log(error.responseText);
                    }
                });
            });
        });
    }


    // method to create a comment in DOM
    let newCommentDom = function (comment, username) {
        return $(
            `<li id= "comment-${comment._id}"
                <p>${comment.content}</p>
                <small>by ${username} </small> 
                
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


    convertPostsToAjax();
    createPost();
    convertCommentsToAjax();
    createComment();
}