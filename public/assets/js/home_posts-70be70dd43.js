{let e=function(){let e=$("#new-post-form");e.submit((function(s){s.preventDefault(),$.ajax({type:"post",url:"/posts/create",data:e.serialize(),success:function(e){let s=t(e.data.post,e.data.username);$("#all-posts").prepend(s),n($(" .delete-post-button",s));let c=document.querySelector(`#post-${e.data.post._id} .new-comment-form`);c.addEventListener("submit",(function(e){e.preventDefault(),l(c)}));let i=document.querySelector("#post-"+e.data.post._id+" .toggle-like-button");i.addEventListener("click",(function(e){e.preventDefault(),u(i)})),o("Post Created!","success")},error:function(e){console.log(e.responseText),o("Something went wrong!","error")}})}))},t=function(e,t){return $(`<div id="post-${e._id}">\n            <hr>\n            <h3>Post</h3>\n            \n            <div class="post">\n            \x3c!-- Content of the Post --\x3e\n            <div class="post-content">\n                <p>${e.content}</p>\n                <p> by ${t} </p>\n\n                \x3c!-- Like button --\x3e\n                <small>\n                    <a class="toggle-like-button post-like" data-likes="0" href="/likes/toggle/?id=${e._id}&type=Post">\n                        0 Likes\n                    </a>\n                </small>\n                &nbsp\n\n                \x3c!-- delete post button --\x3e\n                <small>\n                    <a class="delete-post-button" href="/posts/destroy/${e._id}">Delete Post</a>\n                </small>\n            </div>\n            \n                \n                \x3c!-- Comment Section --\x3e\n                <div class="post-comments">\n                    <h3>Comments</h3>\n                    \n                    <form action="/comments/create" class="new-comment-form" method="POST">\n                        <input type="text" name="content" placeholder="Type here to add comment..." required>\n                        <input type="hidden" name="post" value="${e._id}">\n                        <input type="submit" value="Add Comment">\n                    </form>\n\n                    <div class="post-comments-list">\n                        <ul id="post-comments-${e._id}">\n                            \n                        </ul>\n                    </div>\n                </div>\n            </div>\n        </div>`)},n=function(e){$(e).click((async function(t){t.preventDefault();try{let t=await fetch($(e).prop("href"));t=await t.json(),$(`#post-${t.data.post_id}`).remove(),o("Post Deleted!","success")}catch(e){console.log(e),o("Something went wrong!","error")}}))},o=function(e,t){new Noty({theme:"relax",text:e,type:t,layout:"topRight",timeout:1500}).show()},s=function(){$(".new-comment-form").each((function(){$(this).submit((function(e){e.preventDefault(),l(this)}))}))},l=function(e){$.ajax({type:"post",url:"/comments/create",data:$(e).serialize(),success:function(e){let t=c(e.data.comment,e.data.username);$(`#post-comments-${e.data.comment.post}`).prepend(t),i($(" .delete-comment-button",t));let n=document.querySelector("#comment-"+e.data.comment._id+" .toggle-like-button");n.addEventListener("click",(function(e){e.preventDefault(),u(n)})),o("Comment Created!","success")},error:function(e){console.log(e.responseText)}})},c=function(e,t){return $(`<li id= "comment-${e._id}"\n                <p>${e.content}</p>\n                <small>by ${t} </small> \n                \n                <br>\n                \x3c!-- Like button --\x3e\n                <small>\n                    <a class="toggle-like-button comment-like" data-likes="0" href="/likes/toggle/?id=${e._id}&type=Comment">\n                        0 Likes\n                    </a>\n                </small>\n                &nbsp\n                \n                \x3c!-- Delete comment button --\x3e\n                <small>\n                    <a class="delete-comment-button" href="/comments/destroy/${e._id}">Delete Comment</a>\n                </small>\n            </li>\n        `)},i=function(e){$(e).click((function(t){t.preventDefault(),$.ajax({type:"get",url:$(e).prop("href"),success:function(e){$(`#comment-${e.data.comment_id}`).remove(),o("Comment Deleted!","success")},error:function(e){console.log(e.responseText),o("Something went wrong!","error")}})}))},a=function(){$(".post-comments-list > ul > li").each((function(){let e=$(this),t=$(" .delete-comment-button",e);i(t)}))},m=function(){document.querySelectorAll(".toggle-like-button").forEach((e=>{e.addEventListener("click",(function(t){t.preventDefault(),u(e)}))}))},u=async function(e){let t=await fetch(e.href);t=await t.json();let n=e.dataset.likes;n=t.data.deleted?--n:++n,e.innerHTML=`${n} Likes`,e.dataset.likes=n;let s=e.classList.contains("post-like")?"Post":"Comment",l=t.data.deleted?"Disliked Successfully!":"Liked Successfully!";o(`${s} ${l}`,"success")};(function(){$("#all-posts > div").each((function(){let e=$(this),t=$(" .delete-post-button",e);n(t)}))})(),e(),a(),s(),m()}