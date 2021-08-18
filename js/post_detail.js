const BASE_URL = 'http://localhost:8080'

const tokenArray = ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTk0OThmNzMzNTIwMTBlMDYyOTY4YyIsImlhdCI6MTYyOTI0ODExNSwiZXhwIjoxNjI5ODUyOTE1fQ.aTn_N0SS-QdNDWBxrH8KsztEWN5e0Tzx7fEqFeA1vvk","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTk0NzYxNzMzNTIwMTBlMDYyOTY4NSIsImlhdCI6MTYyOTI1MDI1MSwiZXhwIjoxNjI5ODU1MDUxfQ.Rom2bzH5UBX43lsLAZV-CWhHAk3ro7x_eFIOjTzHCeQ", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTk0NmU5NzMzNTIwMTBlMDYyOTY4MSIsImlhdCI6MTYyOTI1MDMxNiwiZXhwIjoxNjI5ODU1MTE2fQ.sJrH4d3xztm9LZWv1ZobcWLg1qJr6DVg4V1WbcW5C7U",
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTk0NjUzNzMzNTIwMTBlMDYyOTY3ZSIsImlhdCI6MTYyOTI1MDM1MCwiZXhwIjoxNjI5ODU1MTUwfQ.hYdAOckRvl0sLZwXN91nrKRy1H_CPOnHF6q5_MBfHDM"]

function getRandomToken() {
    return tokenArray[Math.floor(Math.random() * (4 - 0)) + 0]
  }

const token = getRandomToken()


//Helper function to use js as selector (learning purposes :D)
function getById(id){ return document.getElementById(id)}


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

let commentsQty = postComments.length
if (commentsQty>2){
    renderComments(postComments, "partial")
}else{
    renderComments(postComments)
}

//////////////////////
//// Post functions///
//////////////////////

// Call to get posts by post ID (used jQuery's ajax)
function getPost(postId) {
    let result
    $.ajax({
        method: "GET",
        url: `${BASE_URL}/posts/${postId}`,
        success: response =>{
            result = response.data.getSinglePost
        },
        async: false
        })
    return result
}

// Updates Post detail html (used javascript DOM methods)
function renderPostHTML(postData){
        
    getById("title").textContent = postData.title
    getById("cover-image").src = postData.coverImage
    getById("content").textContent = postData.content

    // getById("user-image").src = postData.user.profile_image_90
    getById("user-name").textContent = postData.writer.userName

    getById("post-date").textContent = postData.readablePublishedDate
    getById("read-time").textContent = postData.readingTimeMinutes

    getById("reactions-count").textContent = postData.positiveReactionsCount

    getById("postUser").textContent = postData.writer.name

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]
    var f = new Date(postData.writer.joinDate)
    
    getById("joinDate").textContent = monthNames[f.getMonth()] + ' ' + f.getDate() + "," + f.getFullYear()
    let tagsHtml = ""
    postData.tagsList.forEach((tag, idx) => {
        tagsHtml += `<button class="btn-card-${idx+2} text" type="button">#${tag}</button> `
    });
    getById("tags-list").innerHTML = tagsHtml

}

// Call to add 1 to the reaction count - PATCH
function addToReactionCount(){
    let positiveReactionsCount = parseInt(postData.positiveReactionsCount) + 1
    let postReactionObject = JSON.stringify({ positiveReactionsCount })
    let result
    $.ajax({
        method: "PATCH",
        url: `${BASE_URL}/posts/${postId}`,
        contentType:"application/json; charset=utf-8",
        headers: {'Authorization': token},
        data: postReactionObject,
        success: response =>{
            result = response.data.updatePost
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
    $("#reactions-count").text(newReactionCountObject.positiveReactionsCount)
})


//////////////////////////
//// Comments functions///
/////////////////////////

// Save a comment - POST
function addComment(userName, content, postId){
    let commentObject = {userName, content}
    commentJson = JSON.stringify(commentObject)
    let result
    $.ajax({
        method: "POST",
        url: `${BASE_URL}/comments`,
        contentType:"application/json; charset=utf-8",
        data: commentJson,
        success: response =>{
            addCommentToPostId(postId, response.data.postedComment._id)
            postComments = getCommentsByPostId(postId)
            renderComments(postComments)
            result = response.data.postedComment
        },
        async: false
        })
    return result
}

function addCommentToPostId(postId, commentId){
    const comments = postData.comments
    comments.push(commentId)
    const postComments = JSON.stringify({ comments })
    let result
    $.ajax({
        method: "PATCH",
        url: `${BASE_URL}/posts/${postId}`,
        contentType:"application/json; charset=utf-8",
        headers: {'Authorization': token},
        data: postComments,
        success: response =>{
            postData = response.data.updatePost
        },
        async: false
        })
    return result
}

// Get a comment by ID - GET
function getCommentById(commentId){
    let result
    $.ajax({
        method: "GET",
        url: `${BASE_URL}/comments/${commentId}`,
        success: response =>{
            result = response.data.comment
        },
        async: false
        })
    return result
}

// Get all post's comments - GET
function getCommentsByPostId(postId){
    let allComments
    $.ajax({
        method: "GET",
        url: `${BASE_URL}/posts/${postId}`,
        success: response =>{
            allComments = response.data.getSinglePost.comments // esto ya devuelve un arreglo de objetos comentario [ {} , {} ]
        },
        async: false
        })

    allComments.forEach(comment =>{
        comment.readableUsername = getCommentById(comment._id).userName.userName
    })
    return allComments
}

// Add like to comment - PATCH
function addLikeToComment(commentId){
    let reactionsCounter = parseInt(postComments.filter((comment)=>comment._id==commentId)[0].reactionsCounter) + 1
    let commentLikesObject = JSON.stringify({ reactionsCounter })
    let result
    $.ajax({
        method: "PATCH",
        url: `${BASE_URL}/comments/${commentId}`,
        contentType:"application/json; charset=utf-8",
        data: commentLikesObject,
        success: response =>{
            result = response.data.updateComment
            // Update postData
            postComments = getCommentsByPostId(postId)
        },
        async: false
        })
    return result
}


// Builds comment html from comment data
function getCommentHtml(commentData){
    let commentHtml = `
            <div class="comment-box pt-3 d-flex">
            <div class="pfp-collapse-images pr-md-0 d-flex mr-2 flex-column">
                <img class="rounded-circle" width="24px" height="24px" src="img/logged-in-avatar.webp" alt="karen">
                <img class="mt-1" width="24px" height="24px" src="img/collapsed-icon.svg" alt="collapsed">
            </div>
            <div class="comment-info col-11 pl-md-0">
                <div class="card">
                    <div class="card-body pt-1">
                        <div class="comment-person-info d-flex">
                            <p class="card-text"><small class="text-muted"> <b>${commentData.readableUsername}</b></small></p>
                            <p class="card-text pl-1"><small class="text-muted"> ${commentData.readableCreationDate}</small></p>
                        </div>
                        <p>
                        ${commentData.content}
                        </p>
                    </div>
                </div>
                <div class="comment-interaction">
                    <button type="button" class="btn btn-light bg-white like-comment-btn" data-comment-id=${commentData._id}><img src="img/heart-icon.svg" alt="heart" /><span class="font-weight-normal">${commentData.reactionsCounter}</span> likes</button>

                </div>
            </div>
        </div>
    `
    return commentHtml
}

// Renders a single comment at the end of section
function renderAComment(commentData){
    let commentHtml = getCommentHtml(commentData)
    $(".comment-container").append(commentHtml)
}

// Renders all post's comments
function renderComments(postComments, display){
    $(".comment-container").empty()
    if (display == "partial"){
        postComments.slice(0,2).forEach(comment=>{
            renderAComment(comment)
            $("#toogle-show-comments").removeClass("d-none")
        })
    }else{
        postComments.forEach(comment => {
            renderAComment(comment)
            $("#toogle-show-comments").addClass("d-none")
        })
    }

    $(".comments-qty").text(Object.keys(postComments).length)

    // Add listener here so that all comments always have a listener
    $(".like-comment-btn").click( click_event =>{
        let commentId = click_event.currentTarget.dataset.commentId // js
        // let commentId = $(click_event.target).data("comment-id") // jQuery
        let commentLikesObject = addLikeToComment(commentId)
        //document.querySelector(`[data-comment-id=${commentId}] span`).textContent // Js
        $(`[data-comment-id=${commentId}] span`).text(commentLikesObject.reactionsCounter)
    })

}

//Comments Listeners//
//////////////////////

// Submit a comment (used jquery)
$("#add-comment-btn").click(()=>{
    let commentContent = $("#comment-input").val().trim()
    if (!commentContent){
       $("#comment-input").addClass("is-invalid")
    }else{
        let commentIdObject = addComment("6119476173352010e0629685", commentContent, postId)
        $("#comment-input").val("")
        $("html").animate(
            {scrollTop: $(`[data-comment-id=${commentIdObject._id}]`).offset().top - 170},
            800)
    }

})

$("#comment-input").click((e)=>{
    //e.target.classList.remove("is-invalid") // js
    $(e.target).removeClass("is-invalid") // jQuery
})

$("#toogle-show-comments").click(()=>{
    renderComments(postComments)
    $("#toogle-show-comments").addClass("d-none")
})

/*
Pending:
- Enable submit only when there is comment content
- Toogle show/hide comments button
- Style of comments: Buttons, width
- Add/Remove likes/reactions
*/


