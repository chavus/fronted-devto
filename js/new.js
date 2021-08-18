const ENDPOINT = 'http://localhost:8080/posts/'
// Oscar

const tokenArray = ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTk0OThmNzMzNTIwMTBlMDYyOTY4YyIsImlhdCI6MTYyOTI0ODExNSwiZXhwIjoxNjI5ODUyOTE1fQ.aTn_N0SS-QdNDWBxrH8KsztEWN5e0Tzx7fEqFeA1vvk","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTk0NzYxNzMzNTIwMTBlMDYyOTY4NSIsImlhdCI6MTYyOTI1MDI1MSwiZXhwIjoxNjI5ODU1MDUxfQ.Rom2bzH5UBX43lsLAZV-CWhHAk3ro7x_eFIOjTzHCeQ", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTk0NmU5NzMzNTIwMTBlMDYyOTY4MSIsImlhdCI6MTYyOTI1MDMxNiwiZXhwIjoxNjI5ODU1MTE2fQ.sJrH4d3xztm9LZWv1ZobcWLg1qJr6DVg4V1WbcW5C7U",
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTk0NjUzNzMzNTIwMTBlMDYyOTY3ZSIsImlhdCI6MTYyOTI1MDM1MCwiZXhwIjoxNjI5ODU1MTUwfQ.hYdAOckRvl0sLZwXN91nrKRy1H_CPOnHF6q5_MBfHDM"]

function getRandomToken() {
    return tokenArray[Math.floor(Math.random() * (4 - 0)) + 0]
  }

const token = getRandomToken()

function getIdFromToken(token){
    return JSON.parse(window.atob(token.split(".")[1])).id
}

$('#publish-button').click( () =>{

    const date = new Date()
    let readableDate = date.toDateString().split(" ").slice(1,3).join(" ")
    let publishedAt = date.toISOString()
    let randomReaction = Math.floor(Math.random() * 101)
    let randomReading = Math.floor(Math.random() * 11)

    let postObject = { readablePublishedDate: readableDate, 
        publishedTimestamp: publishedAt, positiveReactionsCount: randomReaction, readingTimeMinutes: randomReading,
        writer: getIdFromToken(token)}

    $('.publish-post').each( function(){
        let property = $(this).attr("name")
        let value = $(this).val()
        let postTime 
        if ($(this).attr("name") == "tags"){
            let tags = $(this).val()
            let tagList = tags.split(" ")
            postObject = { ...postObject, "tagsList":tagList}
        }
        
        postObject = {...postObject, [property] : value}
    })
    publishPost(postObject)
})


let asideTitle = `<div class="aside-content-wrapper" style="top: 148px; position: fixed;">
                        <h4 class="aside-title">
                            Writing a Great Post Title
                        </h4>
                        <p class="aside-conten text-muted">
                        Think of your post title as a super short (but compelling!) description — like an overview of the actual post in one short sentence.
                        Use keywords where appropriate to help ensure people can find your post by search.
                        </p>
                    </div>`
let asideTagging = `<div class="aside-content-wrapper" style="top: 218px; position: fixed;">
                            <h4 class="aside-1-title">
                                Tagging Guidelines
                            </h4>
                            <p class="aside-conten text-muted">
                                Tags help people find your post.
                                Think of tags as the topics or categories that best describe your post.
                                Add up to four comma-separated tags per post. Combine tags to reach the appropriate subcommunities.
                                Use existing tags whenever possible.
                                Some tags, such as “help” or “healthydebate”, have special posting guidelines.
                            </p>
                        </div>`
let asideContent = `<div class="aside-content-wrapper" style="top: 354px; position: fixed;">
                        <h4 class="aside-title">
                            Editor Basic
                        </h4>
                        <p class="aside-conten text-muted">
                            Use Markdown to write and format posts.<br/>
                            You can use Liquid tags to add rich content such as Tweets, YouTube videos, etc.
                            In addition to images for the post's content, you can also drag and drop a cover image
                        </p>
                    </div>`

$('#title-input').click(() =>{
    $('.post-aside-container').empty();
    $('.post-aside-container').append(asideTitle);
})

$('#tag-input').click(() =>{
    $('.post-aside-container').empty();
    $('.post-aside-container').append(asideTagging);
})

$('#content-body').click(() =>{
    $('.post-aside-container').empty();
    $('.post-aside-container').append(asideContent);
})

const publishPost2 = postData => {

    
    var xmlhttp = new XMLHttpRequest();       
    xmlhttp.open("POST", ENDPOINT,false);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify( postData ));

    const response = JSON.parse(xmlhttp.responseText);
    console.log(response)
    if (xmlhttp.status == 200)
    {
        let responseKey = response.data.posted._id
        // alert('post id creado: ' + responseKey)
        window.location.href = `post_detail.html?key=${responseKey}` 
    }
    
}


const publishPost = postData => {

    $.ajax({
        url: ENDPOINT,
        type:"POST",
        data: JSON.stringify( postData ),
        contentType:"application/json; charset=utf-8",
        headers: {'Authorization': token},
        dataType:"json",
        success: response => {
            let responseKey = response.data.posted._id
            // alert('post id creado: ' + responseKey)
            window.location.href = `post_detail.html?key=${responseKey}`            
        },
        error: error => {
            console.log(error)
        },
        async:false
      })    
    
}
