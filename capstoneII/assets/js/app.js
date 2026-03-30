const API_KEY = "bc9b5d6fdfc3b3575dbf19f56e420d90"
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const loadFeaturedBtn = document.getElementById("loadFeaturedBtn");
const movieGrid = document.getElementById("movieGrid");
const statusMessage = document.getElementById("statusMessage");

const movieDetailSection = document.getElementById("movieDetailSection");
const movieDetailContent = document.getElementById("movieDetailContent");

const actorDetailSection = document.getElementById("actorDetailSection");
const actorDetailContent = document.getElementById("actorDetailContent");

const arkansasMovies = [
    { title: "Sling Blade", connection: "Arkansas-based actor and Arkansas roots" },
    { title: "Mud", connection: "Regional relevance to Arkansas and the Mississippi Delta" },
    { title: "True Grit", connection: "Included as a featured title in this project collection" },
    { title: "A Face in the Crowd", connection: "Strong Arkansas setting and cultural relevance" },
    { title: "The Firm", connection: "Features Arkansas-connected locations/themes" }
];

const arkansasPeople = [
    { name: "Billy Bob Thornton", connection: "Born in Hot Springs, Arkansas" },
    { name: "Mary Steenburgen", connection: "Born in Newport, Arkansas" },
    { name: "Joey Lauren Adams", connection: "Born in North Little Rock, Arkansas" },
    { name: "Glen Campbell", connection: "Born in Delight, Arkansas" }
];

searchBtn.addEventListener("click", handleSearch);
loadFeaturedBtn.addEventListener("click", loadFeaturedTitles);

searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        handleSearch();
    }
});

function setStatus(message) {
    statusMessage.textContent = message;
}

function clearDetails() {
    movieDetailSection.classList.add("hidden");
    actorDetailSection.classList.add("hidden");
    movieDetailContent.innerHTML = "";
    actorDetailContent.innerHTML = "";
}

function getImageUrl(path) {
    return path ? `${IMAGE_BASE_URL}${path}` : "";
}

function getMovieConnection(title) {
    const match = arkansasMovies.find(
        movie => movie.title.toLowerCase() === title.toLowerCase()
    );
    return match ? match.connection : "General search match";
}

function getPersonConnection(name) {
    const match = arkansasPeople.find(
        person => person.name.toLowerCase() === name.toLowerCase()
    );
    return match ? match.connection : "General search match";
}

function createPosterHTML(imagePath, altText) {
    if (imagePath) {
        return `<img src="${getImageUrl(imagePath)}" alt="${altText}">`;
    }
    return `<div class="poster-placeholder">No Image Available</div>`;
}

function createLargeImageHTML(imagePath, altText) {
    if (imagePath) {
        return `<img src="${getImageUrl(imagePath)}" alt="${altText}">`;
    }
    return `<div class="image-placeholder">No Image Available</div>`;
}

async function fetchJSON(endpoint) {
    const separator = endpoint.includes("?") ? "&" : "?";

    const response = await fetch(
        `${BASE_URL}${endpoint}${separator}api_key=${API_KEY}`
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error("TMDB error:", response.status, errorText);
        throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
}

async function handleSearch() {
    const query = searchInput.value.trim();

    if (!query) {
        setStatus("Please enter a movie or actor name.");
        return;
    }

    clearDetails();
    movieGrid.innerHTML = "";
    setStatus("Loading search results...");

    try {
        const [movieData, personData] = await Promise.all([
            fetchJSON(`/search/movie?query=${encodeURIComponent(query)}`),
            fetchJSON(`/search/person?query=${encodeURIComponent(query)}`)
        ]);

        const movies = movieData.results || [];
        const people = personData.results || [];

        if (movies.length === 0 && people.length === 0) {
            setStatus("No results found.");
            return;
        }

        setStatus(`Showing ${movies.length} movie result(s) and ${people.length} actor result(s).`);
        renderSearchResults(movies, people);
    } catch (error) {
        console.error(error);
        setStatus("There was a problem loading data from TMDB. Check your API key.");
    }
}

function renderSearchResults(movies, people) {
    movieGrid.innerHTML = "";

    movies.slice(0, 8).forEach(movie => {
        const card = document.createElement("div");
        card.className = "movie-card";

        const year = movie.release_date ? movie.release_date.substring(0, 4) : "Unknown";
        const connection = getMovieConnection(movie.title);

        card.innerHTML = `
            <div class="poster">
                ${createPosterHTML(movie.poster_path, movie.title)}
            </div>
            <div class="card-content">
                <span class="badge">Movie</span>
                <h3>${movie.title}</h3>
                <p><strong>Release Year:</strong> ${year}</p>
                <p><strong>Arkansas Connection:</strong> ${connection}</p>
                <div class="card-actions">
                    <button onclick="loadMovieDetails(${movie.id})">View Details</button>
                </div>
            </div>
        `;

        movieGrid.appendChild(card);
    });

    people.slice(0, 8).forEach(person => {
        const card = document.createElement("div");
        card.className = "movie-card";

        const connection = getPersonConnection(person.name);

        card.innerHTML = `
            <div class="poster">
                ${createPosterHTML(person.profile_path, person.name)}
            </div>
            <div class="card-content">
                <span class="badge">Actor / Person</span>
                <h3>${person.name}</h3>
                <p><strong>Known For:</strong> ${person.known_for_department || "Not listed"}</p>
                <p><strong>Arkansas Connection:</strong> ${connection}</p>
                <div class="card-actions">
                    <button onclick="loadActorDetails(${person.id})">View Profile</button>
                </div>
            </div>
        `;

        movieGrid.appendChild(card);
    });
}

async function loadMovieDetails(movieId) {
    clearDetails();
    setStatus("Loading movie details...");

    try {
        const movie = await fetchJSON(`/movie/${movieId}?append_to_response=credits`);

        const genres = movie.genres && movie.genres.length
            ? movie.genres.map(genre => genre.name).join(", ")
            : "Not listed";

        const cast = movie.credits && movie.credits.cast
            ? movie.credits.cast.slice(0, 6)
            : [];

        const castHTML = cast.length
            ? cast.map(person => `
                <li>
                    ${person.name}
                    <button onclick="loadActorDetails(${person.id})">View Actor Profile</button>
                </li>
            `).join("")
            : "<li>No cast information available.</li>";

        const releaseDate = movie.release_date || "Not listed";
        const connection = getMovieConnection(movie.title);

        movieDetailContent.innerHTML = `
            <div class="large-poster">
                ${createLargeImageHTML(movie.poster_path, movie.title)}
            </div>

            <div class="movie-info">
                <h2>${movie.title}</h2>
                <p><strong>Release Date:</strong> ${releaseDate}</p>
                <p><strong>Genre:</strong> ${genres}</p>

                <h3>Overview</h3>
                <p>${movie.overview || "No overview available."}</p>

                <h3>Arkansas Connection</h3>
                <p>${connection}</p>

                <h3>Cast</h3>
                <ul class="cast-list">
                    ${castHTML}
                </ul>
            </div>
        `;

        movieDetailSection.classList.remove("hidden");
        setStatus("Movie details loaded.");
        movieDetailSection.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
        console.error(error);
        setStatus("Could not load movie details.");
    }
}

async function loadActorDetails(personId) {
    clearDetails();
    setStatus("Loading actor profile...");

    try {
        const person = await fetchJSON(`/person/${personId}?append_to_response=movie_credits`);

        const knownFilms = person.movie_credits && person.movie_credits.cast
            ? person.movie_credits.cast
                .filter(movie => movie.title)
                .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                .slice(0, 8)
            : [];

        const filmsHTML = knownFilms.length
            ? knownFilms.map(movie => `
                <li>
                    ${movie.title}
                    <button onclick="loadMovieDetails(${movie.id})">View Movie</button>
                </li>
            `).join("")
            : "<li>No known films available.</li>";

        const birthday = person.birthday || "Not listed";
        const birthplace = person.place_of_birth || "Not listed";
        const connection = getPersonConnection(person.name);

        actorDetailContent.innerHTML = `
            <div class="large-poster">
                ${createLargeImageHTML(person.profile_path, person.name)}
            </div>

            <div class="movie-info">
                <h2>${person.name}</h2>
                <p><strong>Date of Birth:</strong> ${birthday}</p>
                <p><strong>Place of Birth:</strong> ${birthplace}</p>

                <h3>Biography</h3>
                <p>${person.biography || "No biography available."}</p>

                <h3>Arkansas Connection</h3>
                <p>${connection}</p>

                <h3>Known Films</h3>
                <ul class="film-list">
                    ${filmsHTML}
                </ul>
            </div>
        `;

        actorDetailSection.classList.remove("hidden");
        setStatus("Actor profile loaded.");
        actorDetailSection.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
        console.error(error);
        setStatus("Could not load actor details.");
    }
}

async function loadFeaturedTitles() {
    clearDetails();
    movieGrid.innerHTML = "";
    setStatus("Loading featured Arkansas titles...");

    try {
        for (const item of arkansasMovies) {
            const searchData = await fetchJSON(`/search/movie?query=${encodeURIComponent(item.title)}`);

            if (searchData.results && searchData.results.length > 0) {
                const movie = searchData.results[0];
                const year = movie.release_date ? movie.release_date.substring(0, 4) : "Unknown";

                const card = document.createElement("div");
                card.className = "movie-card";

                card.innerHTML = `
                    <div class="poster">
                        ${createPosterHTML(movie.poster_path, movie.title)}
                    </div>
                    <div class="card-content">
                        <span class="badge">Featured Arkansas Title</span>
                        <h3>${movie.title}</h3>
                        <p><strong>Release Year:</strong> ${year}</p>
                        <p><strong>Arkansas Connection:</strong> ${item.connection}</p>
                        <div class="card-actions">
                            <button onclick="loadMovieDetails(${movie.id})">View Details</button>
                        </div>
                    </div>
                `;

                movieGrid.appendChild(card);
            }
        }

        setStatus("Featured Arkansas titles loaded.");
    } catch (error) {
        console.error(error);
        setStatus("Could not load featured titles.");
    }
}

window.loadMovieDetails = loadMovieDetails;
window.loadActorDetails = loadActorDetails;