const endPoint = 'https://miproyecto-jorge-default-rtdb.firebaseio.com'
$(document).ready(function(){
    $.get(endPoint+'/posts/.json', function(data, status){
        console.log("Data: " + data + "\nStatus: " + status);
       /* item.cover_image (imagen de fondo)
          item.user.porfile_image_90 (imagen de usuario redonda)
          item.user.name (nombre de usuario)
          item.title (titulo del post)
          item.tag-list (tag list)*/
          $('#nav-feed').empty();//limpiamos los post antes de iterar
        for(let post in data){
            let articulo = {
                cover:data[post].cover_image,
                user:data[post].user.profile_image_90,
                name:data[post].user.name,
                readable_publish:data[post].readable_publish_date,
                title:data[post].title,
                tagList:data[post].tag_list,
                reading_time_minutes:data[post].reading_time_minutes
            };
            console.log(articulo);
            $('#nav-feed').append(createCard(articulo));
           let tags = $('#nav-feed .card:last-child').find('.card-post-tags')
           /*iteramos sobre el tagList para imprimir todos los tags */
           if(articulo.tagList){
                articulo.tagList.forEach(tag=>{
                    tags.append(`<a>#${tag}<a/>`)
                })
           }
        }
        let firstCard = $('#nav-feed .card:first-child').find('img');
        firstCard.addClass('d-block');
    });
})

function createCard(article){
    let {cover,user,name,readable_publish,title,tagList,reading_time_minutes} = article;
    let templateCard = `<div class="card br-post post-card featured-post-card">
                        <img src=${cover} class="card-img-top d-none" alt="...">
                        <div class="card-body">
                            <div class="d-flex c-header">
                            <img src=${user} alt="" class="br-100">
                            <div class="d-flex c-name">
                                <h6 class="nickname mb-0">${name}</h6></h6>
                                <p>${readable_publish}</p>
                            </div>
                        </div>
                        <div class="card-content pl-5 pt-2">
                            <a href="index2.html" class="post-list">
                            <h4 class="card-title">${title}</h4>
                            </a>
                        <div class="d-flex h-order">
                            <nav class="card-post-tags">
                            </nav>
                        </div>
                        <div class=" d-flex read">
                    <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                        height="24" role="img"
                        aria-labelledby="aavwx5vmqdgx8wvzfg593jo469ge3dnz"
                        class="crayons-icon mb-1">
                        <title id="aavwx5vmqdgx8wvzfg593jo469ge3dnz">
                            Comments</title>
                        <path
                            d="M10.5 5h3a6 6 0 110 12v2.625c-3.75-1.5-9-3.75-9-8.625a6 6 0 016-6zM12 15.5h1.5a4.501 4.501 0 001.722-8.657A4.5 4.5 0 0013.5 6.5h-3A4.5 4.5 0 006 11c0 2.707 1.846 4.475 6 6.36V15.5z">
                        </path>
                    </svg>
                    <button class="comment">Add comment</button>
                    </div>
                    <div class="d-flex">
                    <p class="card-text mb-0"><small class="text-muted">${reading_time_minutes}
                        min read</small></p>
                    <button class="save">Save</button>
                </div>
            </div>
        </div>
        </div>
    </div>`
    return templateCard;
}

