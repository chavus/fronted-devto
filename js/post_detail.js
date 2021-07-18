const BASE_URL = 'https://miproyecto-jorge-default-rtdb.firebaseio.com'

// const goToDetail = (postId) => {
//     console.log(postId);
//     console.log(`post_detail.html?key=${postId}`);
//     window.location.href = `post_detail.html?key=${postId}`

// }

function getById(id){ return document.getElementById(id)}

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

function updatePostHTML(postData){
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

// Get ID of post from URL
let url = new URLSearchParams(location.search)
let postId = url.get("key")

//Get post info
let postData = getPost(postId)
console.log(postData);

//Update HTML 
updatePostHTML(postData)





