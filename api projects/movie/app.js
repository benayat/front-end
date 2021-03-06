/* 
We want a movie to type a movie name in an input and get
the following data displayed on the screen:
1. Movie poster
2. Movie title
3. Genre
4. Year
5. Plot
*/

const key = 'http://www.omdbapi.com/?i=tt3896198&apikey=d071e2ed';

async function getMovie(title) {
  const fetchError = 'something wrong. please try again';
  const response = await fetch(`${key}&t=${title.split(' ').join('+')}`);
  if (response.ok === 'false') throw Error(fetchError);
  const data = await response.json();
  const movie = {
    Movie_poster: data.Poster,
    Movie_title: data.Title,
    Genre: data.Genre,
    Year: data.Released.split(' ').slice(-1)[0],
    Plot: data.Plot,
    Director: data.Director,
    Actors: data.Actors,
    //ratings is an object
  };
  movie.IMDB = data.imdbRating || 'not rated';
  movie.Rotten_Tomatoes = data.Ratings.find(
    (x) => x.Source === 'Rotten Tomatoes'
  )
    ? data.Ratings[1].Value
    : 'not rated';
  movie.Metascore = data.Metascore || 'not rated';
  return movie;
}

function applySearchBar() {
  const errorShow = document.createElement('p');
  errorShow.classList.add('errorShow');
  errorShow.innerHTML = ``;
  const searchBarHTML = `<div class=searchBar>
  <input type="text" placeholder="Search.." name="search">
  <button type="button" class = "searchmovie">search</button>
  </div>
  `;
  document.body.insertAdjacentHTML('afterbegin', searchBarHTML);
  document.body.insertAdjacentElement('beforeend', errorShow);
  const searchButton = document.querySelector('.searchmovie');
  const textSearch = document.querySelector('input[type=text]');
  searchButton.addEventListener('click', searchHandler);
  textSearch.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      document.querySelector('.searchmovie').click();
      event.target.value = '';
    }
  });
}

function applyMovieHTML(MovieData) {
  const MovieHTML = `<div class = "Moviewrapper">
  <img src="${MovieData.Movie_poster}" alt="poster">
  <div class = "movie_data">
  <p>Movie title: ${MovieData.Movie_title}</p>
  <p>Genre: ${MovieData.Genre}</p>
  <p>Year: ${MovieData.Year}</p>
  <p>Plot: ${MovieData.Plot}</p>
  <p>Director: ${MovieData.Director}</p>
  <p>Actors: ${MovieData.Actors}</p>
  <p>IMDB: ${MovieData.IMDB}</p>
  <p>Rotten tomatoes: ${MovieData.Rotten_Tomatoes}</p>
  <p>MetaCritic: ${MovieData.Metascore}</p>
  </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', MovieHTML);
}

async function searchHandler(event) {
  debugger;
  document.querySelector('.errorShow').innerHTML = ``;
  const usermovieData = new Map();
  const title = event.target.previousElementSibling.value;
  try {
    const movieData = await getMovie(title);
    if (usermovieData.has(movieData.Movie_title)) {
      throw Error('movie was search before. snooping history:');
    } else {
      usermovieData.set(movieData.Movie_title, movieData);
      applyMovieHTML(movieData);
    }
  } catch (error) {
    document.querySelector('.errorShow').innerHTML = error;
    if (error === 'movie was search before. snooping history:') {
      applyMovieHTML(movieData);
    }
  }
}

applySearchBar();
