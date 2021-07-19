const BASE_URL = 'https://miproyecto-jorge-default-rtdb.firebaseio.com'

//Helper function to use js as selector (learning purposes :D)
function getById(id){ return document.getElementById(id)}

//////////////////////
//// Post functions///
//////////////////////

// Call to get posts by post ID (used jQuery's ajax)
function getPost(postId) {
    let result
    $.ajax({
        method: "GET",
        url: `${BASE_URL}/posts/${postId}/.json`,
        success: response =>{
            result = response
        },
        async: false
        })
    return result
}

// Updates Post detail html (used javascript DOM methods)
function renderPostHTML(postData){
    getById("title").textContent = postData.title
    getById("cover-image").src = postData.cover_image
    getById("content").textContent = postData.content

    getById("user-image").src = postData.user.profile_image_90
    getById("user-name").textContent = postData.user.name

    getById("post-date").textContent = postData.readable_publish_date
    getById("read-time").textContent = postData.reading_time_minutes

    getById("reactions-count").textContent = postData.positive_reactions_count

    let tagsHtml = ""
    postData.tag_list.forEach((tag, idx) => {
        tagsHtml += `<button class="btn-card-${idx+2} text" type="button">#${tag}</button> `
    });
    getById("tags-list").innerHTML = tagsHtml

}

// Call to add 1 to the reaction count - PATCH
function addToReactionCount(){
    //-MeltVhifoieoQDV-DfX
    let positive_reactions_count = Number(postData.positive_reactions_count) + 1
    let postReactionObject = JSON.stringify({positive_reactions_count})
    let result
    $.ajax({
        method: "PATCH",
        url: `${BASE_URL}/posts/${postId}/.json`,
        data: postReactionObject,
        success: response =>{
            result = response
            // Update postData
            postData = getPost(postId)
        },
        async: false
        })
    return result
}

//// Post Listeners//////
/////////////////////////

//Reactions button (to add)
$("#reactions-btn").click(()=>{
    let newReactionCountObject = addToReactionCount()
    $("#reactions-count").text(newReactionCountObject.positive_reactions_count)
})


//////////////////////////
//// Comments functions///
/////////////////////////

// Save a comment
function addComment(author, content, postId){
    let commentObject = {author, content, postId}
    const date = new Date()
    commentObject["commentDate"] = date
    commentObject["readableCommentDate"] = date.toDateString().split(" ").slice(1,3).join(" ")
    commentObject["likes"] = 0
    commentJson = JSON.stringify(commentObject)

    let result
    $.ajax({
        method: "POST",
        url: `${BASE_URL}/comments/.json`,
        data: commentJson,
        success: response =>{
            let postComments = getCommentsByPostId(postId)
            renderComments(postComments)
            result = response
        },
        async: false
        })
    return result
}

// Get a comment by ID
function getCommentById(commentId){
    let result
    $.ajax({
        method: "GET",
        url: `${BASE_URL}/comments/${commentId}/.json`,
        success: response =>{
            result = response
        },
        async: false
        })
    return result
}

// Get all post's comments
function getCommentsByPostId(postId){
    let allComments
    $.ajax({
        method: "GET",
        url: `${BASE_URL}/comments/.json`,
        success: response =>{
            allComments = response
        },
        async: false
        })

    let commentsByPostId = {}
    for (commentKey in allComments){
        let commentValues = allComments[commentKey]
        commentsByPostId = commentValues.postId === postId ? {...commentsByPostId, [commentKey]: commentValues} : commentsByPostId
    }
    return commentsByPostId
}

// Builds comment html from comment data
function getCommentHtml(commentId, commentsData){
    let commentHtml = `
            <div class="comment-box pt-3 d-flex">
            <div class="pfp-collapse-images pr-md-0 d-flex mr-2 flex-column">
                <img class="rounded-circle" width="24px" height="24px" src="img/comment-person.png" alt="karen">
                <img class="mt-1" width="24px" height="24px" src="img/collapsed-icon.svg" alt="collapsed">
            </div>
            <div class="comment-info col-11 pl-md-0">
                <div class="card">
                    <div class="card-body pt-1">
                        <div class="comment-person-info d-flex">
                            <p class="card-text"><small class="text-muted"> <b>${commentsData.author}</b></small></p>
                            <p class="card-text pl-1"><small class="text-muted"> ${commentsData.readableCommentDate}</small></p>
                        </div>
                        <p>
                        ${commentsData.content}
                        </p>
                    </div>
                </div>
                <div class="comment-interaction">
                    <button type="button" class="btn btn-light bg-white like-comment-btn" data-commentd-id=${commentId}><img src="img/heart-icon.svg" alt="heart" /><span class="font-weight-normal" > ${commentsData.likes} </span> likes</button>
                    <button type="button" class="btn btn-light bg-white"><img src="img/comments-icon.svg" alt="comment" />0</button>
                </div>
            </div>
        </div>
    `
    return commentHtml
}

// Renders a single comment at the end of section
function renderAComment(commentId, comment){
    let commentHtml = getCommentHtml(commentId, comment)
    $(".comment-container").append(commentHtml)
}

// Renders all post's comments
function renderComments(postComments, display){
    $(".comment-container").empty()
    if (display == "partial"){
        Object.keys(postComments).slice(0,2).forEach(commentId=>{
            renderAComment(commentId, postComments[commentId])
            $("#toogle-show-comments").removeClass("d-none")
        })
    }else{
        for (commentId in postComments){
            renderAComment(commentId, postComments[commentId])
        }
    }

    $(".comments-qty").text(Object.keys(postComments).length)

}

//Comments Listeners//
//////////////////////

// Submit a comment (used jquery)
$("#add-comment-btn").click(()=>{
    let commentContent = $("#comment-input").val()
    let ret = addComment("Salvador Jiménez", commentContent, postId)
    $("#comment-input").val("")
})

$("#toogle-show-comments").click(()=>{
    renderComments(postComments)
    $("#toogle-show-comments").addClass("d-none")
})

///////////////////////
//// On page load /////
///////////////////////

// Get ID of post from URL
let url = new URLSearchParams(location.search)
let postId = url.get("key")

//Get post info
let postData = getPost(postId)
let postComments = getCommentsByPostId(postId)

//Update HTML 
renderPostHTML(postData)

let commentsQty = Object.keys(postComments).length
if (commentsQty>2){
    renderComments(postComments, "partial")
}else{
    renderComments(postComments)
}

/*
Pending:
- Add count to reaction (heart)
- Add count to comments likes
- Toogle show/hide comments button
- Style of comments
- Enable submit when there is comment content
*/


