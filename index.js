const parentElement=document.querySelector(".main");
const searchInput=document.querySelector(".input");
const movieRatings=document.querySelector("#rating-select");
const movieGenre=document.querySelector("#genre-select");

let searchValue="";
let ratings=0;
let genre="";
let filteredArrayOfMovies=[];

const URL="https://tangerine-frangollo-e36f0d.netlify.app/.netlify/functions/app/api/movies";

const getMovies=async(url)=>{
    try{
        const {data}=await axios.get(url);
        return data;
    }catch(err){
        console.log(err);
        console.log("error in getting data")

    }
}

let movies=await getMovies(URL);
console.log(movies);
const createElement=(element)=>document.createElement(element);

// function create movie cards
const createMovieCard=(movies)=>{

    for(let movie of movies){
        //create parent container
        const cardContainer=createElement("div");
        cardContainer.classList.add("card","shadow");

        //create image container
        const imageContainer=createElement("div");
        imageContainer.classList.add("card-image-container");

        //creating card image
        const imageEle=createElement("img");
        imageEle.classList.add("card-image");
        imageEle.setAttribute("src",movie.img_link);
        imageEle.setAttribute("alt",movie.name);
        imageContainer.appendChild(imageEle);

        cardContainer.appendChild(imageContainer);

        //creating card details conatiner
        const cardDetails=createElement("div");
        cardDetails.classList.add("movie-details");

        //card title
        const titleEle=createElement("p");
        titleEle.classList.add("title");
        titleEle.innerText=movie.name;
        cardDetails.appendChild(titleEle);

        //card genre
        const genreEle=createElement("p");
        genreEle.classList.add("gener");
        genreEle.innerText=`Genre: ${movie.genre}`;
        cardDetails.appendChild(genreEle);

        //ratings and duration
        const movieRating=createElement("div");
        movieRating.classList.add("ratings");

        //star rating
        const ratings=createElement("div");
        ratings.classList.add("star-rating");

        //star icon
        const starIcon=createElement("span");
        starIcon.classList.add("material-icons-outlined");
        starIcon.innerText="star";
        ratings.appendChild(starIcon);

        //rating
        const ratingValue=createElement("span");
        ratingValue.innerText=movie.imdb_rating;
        ratings.appendChild(ratingValue);

        movieRating.appendChild(ratings);

        //duration
        const movieDuration=createElement("p");
        movieDuration.innerText=`${movie.duration} min`;
        movieRating.appendChild(movieDuration)

        cardDetails.appendChild(movieRating);
        cardContainer.appendChild(cardDetails);

        parentElement.appendChild(cardContainer);
        

    }
};

function getFilteredData(){
    filteredArrayOfMovies=searchValue?.length > 0 ? 
        movies.filter(
            (movie)=> 
                searchValue===movie.name.toLowerCase() || 
                searchValue===movie.director_name.toLowerCase() ||
                movie.writter_name.toLowerCase().split(",").includes(searchValue) ||
                movie.cast_name.toLowerCase().split(",").includes(searchValue)
                ): movies;
            if(ratings>0){
                filteredArrayOfMovies=searchValue?.length>0 ? filteredArrayOfMovies : movies;
                filteredArrayOfMovies=filteredArrayOfMovies.filter(
                    (movie)=>movie.imdb_rating >= ratings
                )
            }
            if(genre?.length>0){
                filteredArrayOfMovies=searchValue?.length>0 || ratings > 7 ? filteredArrayOfMovies : movies;
                filteredArrayOfMovies=filteredArrayOfMovies.filter(
                    (movie)=>movie.genre.includes(genre)
                );
            }
    return filteredArrayOfMovies;
}


function handleSearch(event){
    searchValue=event.target.value.toLowerCase();
    console.log(searchValue);  
    let filterBySearch=getFilteredData(); 
    parentElement.innerHTML="";
    createMovieCard(filterBySearch)
    
}

function debounce(callback,delay){
    let timerId;
    return (...args)=>{
        clearTimeout(timerId);
        timerId=setTimeout(()=>{callback(...args);},delay);
    }
}

function handleRatingSelector(event){
    ratings=event.target.value;
    let filterByRating=getFilteredData();
    parentElement.innerHTML="";
    createMovieCard(ratings ? filterByRating : movies)
}
const debounceInput=debounce(handleSearch,800);

searchInput.addEventListener("keyup",debounceInput);

movieRatings.addEventListener("change",handleRatingSelector);

//filter by genre
const genres=movies.reduce((acc,cur)=>{
    let genreArr=[];
    let tempGenreArr=cur.genre.split(",");
    acc=[...acc,...tempGenreArr];
    for (let genre of acc){
        if(!genreArr.includes(genre)){
            genreArr=[...genreArr,genre]
        }
    }
    return genreArr;
},[]);
console.log(genres);

for (let genre of genres){
    const option=createElement("option");
    option.classList.add("option");
    option.setAttribute("value",genre);
    option.innerText=genre;
    movieGenre.appendChild(option);
}

function handleGenreSelect(event){
    genre=event.target.value;
    const filterByGenre=getFilteredData();
    parentElement.innerHTML="";
    createMovieCard(genre ? filterByGenre : movies)
}

movieGenre.addEventListener("change",handleGenreSelect);


createMovieCard(movies);
