const endPoint = 'http://localhost:8080'
/*claves del queryString*/
const urlParams = new URLSearchParams(location.search);
/*cunado buscamos nos redirigimos a la vista de busqueda y pasamos el parametro
de busqueda a travez de la url */
let busqueda = urlParams.get('busqueda');
$(document).ready(function(){
    /*si existe un parametro de busqueda en la URL imprimimos los post cuyo
    searchString incluya dicho parameto */
    if(busqueda){
        printAllCardsSearch(busqueda,'relevance');    
    }
    /*de lo conrtrario imprimimos todos los post*/
    else{
        printAllCards();
        printAside();
    }
})
function compareYear(dateToCompare){
    let currentDate = moment(new Date());
    let postDate = moment(new Date(dateToCompare));
    return currentDate.year() == postDate.year();
}
function compareMonth(dateToCompare){
    let currentDate = moment(new Date());
    let postDate = moment(new Date(dateToCompare));
    return currentDate.year() == postDate.year() &&  currentDate.month() == postDate.month();
}
function compareWeek(dateToCompare){
    let currentDate = moment(new Date());
    let postDate = moment(new Date(dateToCompare));
    return currentDate.year() == postDate.year() &&  currentDate.isoWeek() == postDate.isoWeek();
}



function printAllCards(option='feed'){
    let posts = bringPosts();
    //console.log(`desde printAllCards: ${posts}` )
    let postFiltrados;
    if(option=='feed'){
        postFiltrados=posts;
    }
    if(option=='week'){
        postFiltrados=posts.filter(post=>compareWeek(post.published_timestamp));
    }
    if(option=='month'){
        postFiltrados=posts.filter(post=>compareMonth(post.published_timestamp));
    }
    if(option=='year'){
        postFiltrados=posts.filter(post=>compareYear(post.published_timestamp));
    }
    if(option=='latest'){
        postFiltrados = posts.sort(function(a,b){
            return moment(new Date(b.published_timestamp)).valueOf() - moment(new Date(a.published_timestamp)).valueOf()
            })
        postFiltrados = postFiltrados.slice(0,5);
    }
    $('#nav-feed').empty();
    postFiltrados.forEach(post=>poblateCard(post))
    let firstCard = $('#nav-feed .card:first-child').find('img');
    firstCard.addClass('d-block');
    return postFiltrados;
}



function poblateCard(article){
    /*creamos un string con el formato del post y lo populamos con los datos
    del objeto que recibe la funcion como argumento*/
    let newCard = createCard(article);
    /*lo agregamos al contenedor padre*/
    $('#nav-feed').append(newCard);
    let tags = $('#nav-feed .card:last-child').find('.card-post-tags')
    /*iteramos sobre el tagList para imprimir todos los tags */
    if(article.tagList){
        article.tagList.forEach(tag=>{
            tags.append(`<a>#${tag}<a/>`)
        })
    }
}

function createCard(article){
    /*string con el formato del post*/
    //console.log(`aquÃ­ pinta la card:  ${JSON.stringify(article)}`)
    let {cover,user,name,readable_publish,title,tagList,reading_time_minutes,published_timestamp,postId,comments,positives} = article;
    //console.log('destructuring: ', cover,user,name,readable_publish,title,tagList,reading_time_minutes,published_timestamp,postId,comments,positives )
    let templateCard = `<div class="card br-post post-card featured-post-card mb-2">
                        <img src=${cover} class="card-img-top d-none" alt="...">
                        <div class="card-body">
                            <div class="d-flex c-header">
                            <img src="images/pics/me and michael.jpg" alt="" class="br-100">
                            <div class="d-flex c-name">
                                <h6 class="nickname mb-0">${name}</h6></h6>
                                <p>${readable_publish}</p>
                            </div>
                        </div>
                        <div class="card-content pl-5 pt-2">
                            <a href="post_detail.html?key=${postId}" class="post-list">
                            <h4 class="card-title">${title}</h4>
                            </a>
                        <div class="d-flex h-order">
                            <nav class="card-post-tags">
                            </nav>
                        </div>
                        <div class=" d-flex read">
                    
                    <div class="d-flex">
                    <div>
                    <a href="post_detail.html?key=${postId}" class="post-list">
                    <svg class="crayons-icon" width="24" height="24" 
                        xmlns="http://www.w3.org/2000/svg"><path d="M18.884 12.595l.01.011L12 19.5l-6.894-6.894.01-.01A4.875 4.875 0 0112 5.73a4.875 4.875 0 016.884 6.865zM6.431 7.037a3.375 3.375 0 000 4.773L12 17.38l5.569-5.569a3.375 3.375 0 10-4.773-4.773L9.613 10.22l-1.06-1.062 2.371-2.372a3.375 3.375 0 00-4.492.25v.001z"></path></svg>
                        <button class="comment"><span>${positives}</span> reactions</button>
                    </a>
                        </div>
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
                    <button class="comment"><span>${comments}</span> comment</button>
                    </div>
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
/*manejador de eventos del filtro*/
$('#nav-tab').on('click',function(event){
    let target = event.target;
    switch(target.id) {
        case 'feed':
            printAllCards('feed');
            break;
        case 'latest':
            printAllCards('latest');
            break;
        case 'week':
            printAllCards('week');
            break;
        case 'month':
            printAllCards('month');
            break;
        case 'year':
            printAllCards('year');
            break;
        case 'newest':
            printAllCardsSearch(busqueda,'desc');
            break;
        case 'oldest':
            printAllCardsSearch(busqueda,'asc');
            break;
        case 'relevance':
            printAllCardsSearch(busqueda,'relevance');
            break;
    }
    
})
/*manejador de eventos de la busqueda*/
$('#search').on('search',function(event){
    location.href = `vistaBusqueda.html?busqueda=${$(this).val()}`
})
/*manejador de eventos de la busqueda (mobile vista busqueda)*/
$('#searchMobile').on('search',function(event){
    location.href = `vistaBusqueda.html?busqueda=${$(this).val()}`
})
/*funcion para traer comentarios de manera sincrona*/
function bringComments(){
    let commentsObject;
    $.ajax({
        method:'GET',
        url:endPoint+'/comments/.json',
        success: function (result) {
            commentsObject = result;
        },
        async: false
    });
    let commentsArray = Object.values(commentsObject)
    return commentsArray;
}
/*funcion para crear comentarios*/
function createCommentary(postId,author,content){
    $.ajax({
        method:'POST',
        url:endPoint+'/comments/.json',
        data:JSON.stringify({postId,author,content}),
        success: function (result) {
            //console.log(result);
        },
        async: true
    });
}


function bringPosts(){
    //let postsMatrix = null
    let postsObject
    $.ajax({
        method:'GET',
        url:endPoint+'/posts',
        success: function (result) {

            postsObject = result;
             //postsMatrix = postsObject.data.allPosts
            //console.log(postsObject)
            //console.log(postsObject.data.allPosts[0].title)
        },
        async: false
    });
        //console.log(`Este es el postObject: ${JSON.stringify(postsObject)}`)
    
        //let comments = bringComments();
    //let postsMatrix = Object.entries(postsObject);

    let postsMatrix = postsObject.data.allPosts
    //console.log(`Este es el postmatrix: ${JSON.stringify(postsMatrix)}`)
    let postsArray = postsMatrix.map(post=>{
        //console.log(`Este es el post: ${post}`)
        return {
            
            cover:post.coverImage,
            
            /*avatar del usuario*/
            //user:post.writer,
            /*nombre del usuario*/
            name:post.writer.userName,
            /*fecha de publicacion (formato corto)*/
            readable_publish:post.readablePublishedDate,
            /*titulo del post*/
            //title:post[1].title,
            title: post.title,
            /*arreglo con los tags*/
            tagList:post.tagsList,
            /*tiempo de lectura*/
            reading_time_minutes:post.readingTimeMinutes,
            /*fecha de publicacion (formato largo)*/
            published_timestamp:post.publishedTimestamp,
            /*clave de nuestro post en nuetria API*/
            postId:post._id,
            /*string con los tags*/
            tagString:post.tagsList.join(' '),
            /*comentarios de cada post*/
            comments: post.comments.length,
            /*respuestas positivas al post*/
            /*este criterio de orden es tentativo (puede cambiar despues)*/
            positives:post.positiveReactionsCount,
            searchString:`${post.writer.userName} ${post.tagsList.join(' ')} ${post.title}`.toLowerCase()
        }
    })
    //console.log(`Este es el post: ${JSON.stringify(postsArray)}`)
    return postsArray;
    
}

function printAllCardsSearch(busqueda,order='desc'){
    let posts = bringPosts();
    let postFiltrados = posts.filter(post =>{
        return post.searchString.includes(busqueda.toLowerCase());
    }
    )
/*si argumento order es el parametro 'desc', ordenamos los post del mas reciente al mas viejo*/
    if(order=='desc'){
        postFiltrados.sort(function(a,b){
            return moment(new Date(b.published_timestamp)).valueOf() - moment(new Date(a.published_timestamp)).valueOf()
            })
        }
/*si argumento order es el parametro 'asc', ordenamos los post del mas viejo al mas reciente*/
    if(order=='asc'){
        postFiltrados.sort(function(a,b){
            return  moment(new Date(a.published_timestamp)).valueOf() - moment(new Date(b.published_timestamp)).valueOf()
        })
    }
/*ordenamos por relevancia*/
    if(order=='relevance'){
        postFiltrados.sort(function(a,b){
            return b.positives - a.positives;
        })
    }
    $('#nav-feed').empty();
    postFiltrados.forEach(post=>poblateCard(post))
    let firstCard = $('#nav-feed .card:first-child').find('img');
    firstCard.addClass('d-block');
    return postFiltrados;
}

function createListItem(article){
    let {title,postId,comments} = article
    let listItemTemplate = `<li class="list-group-item">
                                    <a href="post_detail.html?key=${postId}" class="post-list">
                                    ${title}
                                    </a>
                                    <div>
                                        <p class="text-muted l-text">${comments.length} comments</p>
                                    </div>
                                
                            </li>`  
    return  listItemTemplate;
}
/*agregamos la funcion que renderiza el aside*/
function printAside(){
    let posts = bringPosts();
    //console.log(posts)
    let help = posts.filter(post =>{
        return post.searchString.includes('help')
    })
    let news = posts.filter(post =>{
        return post.searchString.includes('new')
    })
    //console.log(help)
    //console.log(news)
    $('#newsPost').empty();
    news.forEach(post=>{
        $('#newsPost').append(createListItem(post));
    })

    $('#helpPost').empty();
    help.forEach(post=>{
        $('#helpPost').append(createListItem(post));
    })
}
/*agregamos el manejador del boton de hamburguesa*/
$('#opennav').on('click',function(){
    $('#navbar').removeClass('d-none')
})
$('#closenav').on('click',function(){
    $('#navbar').addClass('d-none')
})

$('#createPost').on('click',function(){
    location.href = 'New.html'
})