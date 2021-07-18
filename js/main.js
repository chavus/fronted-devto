const endPoint = 'https://miproyecto-jorge-default-rtdb.firebaseio.com'
/*claves del queryString*/
const urlParams = new URLSearchParams(location.search);
/*cunado buscamos nos redirigimos a la vista de busqueda y pasamos el parametro
de busqueda a travez de la url */
let busqueda = urlParams.get('busqueda');
$(document).ready(function(){
    /*si existe un parametro de busqueda en la URL imprimimos los post cuyo
    searchString incluya dicho parameto */
    if(busqueda){
        printAllCards(busqueda);    
    }
    /*de lo conrtrario imprimimos todos los post*/
    else{
        printAllCards();
    }
})
function printAllCards(option=null,order='desc'){
    $.get(endPoint+'/posts/.json', function(data, status){
        console.log("Data: " + data + "\nStatus: " + status);
        /*vaciamos al contenedor padre antes de renderizar*/
        $('#nav-feed').empty();
        /*creamos un arreglo vacio donde pondremos los datos
        que necesitamos para pintar nuestros posts*/
        let posts = [];
        /*consultamos los comentarios asincronamente y los guardamos 
        en un arreglo*/
        let comments = bringComments();
        /*iteramos sobre el el objeto que nos traimos de nuestra api*/
        for(let post in data){
            let articulo = {
                /*imagen de la parte superir del post*/
                cover:data[post].cover_image,
                /*avatar del usuario*/
                user:data[post].user.profile_image_90,
                /*nombre del usuario*/
                name:data[post].user.name,
                /*fecha de publicacion (formato corto)*/
                readable_publish:data[post].readable_publish_date,
                /*titulo del post*/
                title:data[post].title,
                /*arreglo con los tags*/
                tagList:data[post].tag_list,
                /*tiempo de lectura*/
                reading_time_minutes:data[post].reading_time_minutes,
                /*fecha de publicacion (formato largo)*/
                created_at:data[post].created_at,
                /*clave de nuestro post en nuetria API*/
                postId:post,
                /*string con los tags*/
                tagString:data[post].tags,
                /*comentarios de cada post*/
                comments:comments.filter(item=>item.postId == post),
                /*respuestas positivas al post*/
                positives:data[post].positive_reactions_count
            };
            posts.push(articulo);
        }
        /*si argumento order es el parametro 'desc', ordenamos los post del mas reciente al mas viejo*/
        if(order=='desc'){
            posts.sort(function(a,b){
                return moment(new Date(b.created_at)).valueOf() - moment(new Date(a.created_at)).valueOf()
            })
        }
        /*si argumento order es el parametro 'asc', ordenamos los post del mas viejo al mas reciente*/
        if(order=='asc'){
            posts.sort(function(a,b){
                return  moment(new Date(a.created_at)).valueOf() - moment(new Date(b.created_at)).valueOf()
            })
        }
        /*ordenamos por relevancia*/
        /*if(relevance){
            posts.sort(function(a,b){
                return b.positives - a.positives;
            })
        }*/
        let printedArticles=0;
        for(let articulo of posts){
            /*utilizamos la libreria moment para poder realizar los filtros*/
            let fecha = new Date(articulo.created_at)
            let today = new Date();
            let fechaMoment = moment(fecha)
            let todayMoment = moment(today) 
            /*creamos un string de busqueda contatenando en minusculas:
            el nombre del autor del post,el titulo del post y el tagString*/
            let searchString = `${articulo.name} ${articulo.title} ${articulo.tagString}`.toLowerCase();
            switch(option){
                /*imprimimos todos los post del mas reciente al mas viejo*/
                case null:
                    poblateCard(articulo)
                    break;
                case 'feed':
                    poblateCard(articulo)
                    break;
                /*imprimimos los 5 primeros post */
                case 'latest':
                    if(printedArticles==5){
                        let firstCard = $('#nav-feed .card:first-child').find('img');
                        firstCard.addClass('d-block');
                        return;
                    }
                    poblateCard(articulo);
                    printedArticles++;
                    break;
                /*imprimimos todos los post que sean del ano actual*/
                case 'year':
                    if(fechaMoment.year() == todayMoment.year()){
                        poblateCard(articulo)
                        break;
                    }
                /*imprimimos todos los post que sean del ano actual y el mes actual*/
                case 'month':
                    if(fechaMoment.year() == todayMoment.year()){
                        if(fechaMoment.month() == todayMoment.month()){
                            poblateCard(articulo)
                            break;
                        }
                    }
                case 'week':
                /*imprimimos todos los post que sean del ano actual y la semana actual*/
                    if(fechaMoment.year() == todayMoment.year()){
                        if(fechaMoment.isoWeek() == todayMoment.isoWeek()){
                            poblateCard(articulo)
                            break;
                        }
                    }
                default:
                /*el argumento option tambien puede recibir un string que representa
                una palabra que buscaremos en el searchString*/
                    if(searchString.includes(option.toLowerCase())){
                        poblateCard(articulo)
                        break;
                    }
            }

        }
        /*una vez renderizadas todos los post mostramos el cover del primer post*/
        let firstCard = $('#nav-feed .card:first-child').find('img');
        firstCard.addClass('d-block');
    });
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
    let {cover,user,name,readable_publish,title,tagList,reading_time_minutes,created_at,postId,comments} = article;
    let templateCard = `<div class="card br-post post-card featured-post-card">
                        <img src=${cover} class="card-img-top d-none" alt="...">
                        <div class="card-body">
                            <div class="d-flex c-header">
                            <img src=${user} alt="" class="br-100">
                            <div class="d-flex c-name">
                                <h6 class="nickname mb-0">${name}</h6></h6>
                                <p>${readable_publish}</p>
                                <p>${new Date(created_at)}</p>

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
                    <button class="comment"><span>${comments.length}</span> comment</button>
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
            printAllCards(busqueda,'desc');
            break;
        case 'oldest':
            printAllCards(busqueda,'asc');
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
            console.log(result);
        },
        async: true
    });
}