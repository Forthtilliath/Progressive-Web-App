const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const form = $("#searchForm");
const searchInput = $("#searchInput");
const result = $("#result");

const language = 'fr-FR';

const fetchMovies = (search) => {
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=a893fe4aea74aa5169dae6a817f464c4&language=${language}&query=${search}`)
    .then((res) => res.json())
    .then((res) => moviesDisplay(res.results));
};

const moviesDisplay = (movies) => {
  movies.length = 12;

  result.innerHTML = movies
    .map(
      (movie) =>
        `
        <li>
            <h2>${movie.original_title}</h2>
            <div class="card-content">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" />
                <div class="infos">
                    <p>${movie.overview}</p>
                    <p>Popularité : ${movie.popularity} &star;</p>
                </div>
            </div>
        </li>
        `
    )
    .join("");
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchMovies(searchInput.value);
});
