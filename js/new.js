const ENDPOINT = 'http://localhost:8080/posts/'

$('#publish-button').click( () =>{
    const date = new Date()
    let readableDate = date.toDateString().split(" ").slice(1,3).join(" ")
    let publishedAt = date.toISOString()
    let randomReaction = Math.floor(Math.random() * 101)
    let randomReading = Math.floor(Math.random() * 11)

    let postObject = { readablePublishedDate: readableDate, 
        publishedTimestamp: publishedAt, positiveReactionsCount: randomReaction, readingTimeMinutes: randomReading,
        writer: "6119498f73352010e062968c"}

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

const publishPost = postData => {

    
    var xmlhttp = new XMLHttpRequest();       
    xmlhttp.open("POST", ENDPOINT,false);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify( postData ));

    const response = JSON.parse(xmlhttp.responseText);
    if (xmlhttp.status == 200)
    {
        let responseKey = response.data.posted._id
        alert('post id creado: ' + responseKey)
        window.location.href = `post_detail.html?key=${responseKey}` 
    }
    
}


/*
const publishPost = postData => {
   
    $.ajax({
        type: "POST",
        url: ENDPOINT,
        data:JSON.stringify( postData ),
        success: response => {
            let responseKey = response.name
            window.location.href = `post_detail.html?key=${responseKey}`            
        },
        error: error => {
            console.log(error)
        },
        async:false
    });
    
}
*/