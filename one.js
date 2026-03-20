const apiKey="8f0f4209e7ae9f7d2b3abce449c5d179";
const baseURL="https://api.themoviedb.org/3";
const imageBaseURL="https://image.tmdb.org/t/p/w500";
function fetchNewReleases(){
    fetch(baseURL+"/movie/now_playing?api_key="+apiKey)
    .then(response=>response.json())
    .then(data => {
        const movies = data.results;
        const container = document.querySelector(".nw1");

        movies.forEach(movie => {
          let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
           const isFavorited = favorites.some(fav => fav.title === movie.title);
            const card = document.createElement("div");
            card.className = "movie-card";
            card.innerHTML = `
                <div class="poster-case">
                    <img src="${imageBaseURL}${movie.poster_path}" alt="${movie.title}">
                </div>
                <h3>${movie.title}</h3>
                <button class="heart-btn">♡</button>
            `;
            container.appendChild(card);

            const heartBtn = card.querySelector(".heart-btn");
            if (isFavorited) {
             heartBtn.textContent = "♥";
            }

            heartBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                if (heartBtn.textContent === "♥") {
                    heartBtn.textContent = "♡";
                    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
                    favorites = favorites.filter(fav => fav.title !== movie.title);
                    localStorage.setItem("favorites", JSON.stringify(favorites));
                } else {
                    heartBtn.textContent = "♥";
                    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
                    favorites.push({ title: movie.title, poster: movie.poster_path });
                    localStorage.setItem("favorites", JSON.stringify(favorites));
                }
                displayFavorites();
            });

            card.addEventListener("click", () => {
                let recentlyWatched = JSON.parse(localStorage.getItem("recentlyWatched")) || [];
                const alreadyExists = recentlyWatched.some(m => m.title === movie.title);
                if (!alreadyExists) {
                    recentlyWatched.push({
                        title: movie.title,
                        poster: movie.poster_path,
                        progress: Math.floor(Math.random() * 100)
                    });
                    localStorage.setItem("recentlyWatched", JSON.stringify(recentlyWatched));
                }
                displayRecentlyWatched();
            });
            let hoverTimer;
            card.addEventListener("mouseenter", () => {
            hoverTimer = setTimeout(() => {
             fetchTrailer(movie.id);
            }, 1400);
            });
           card.addEventListener("mouseleave", () => {
            clearTimeout(hoverTimer);
         });
        });
    });
}

fetchNewReleases();

function displayFavorites(){
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const container = document.querySelector(".f1");
    container.innerHTML = "";
    favorites.forEach(movie => {
        const card = document.createElement("div");
        card.className = "movie-card";
        card.innerHTML = `
            <div class="poster-case">
                <img src="${imageBaseURL}${movie.poster}" alt="${movie.title}">
            </div>
            <h3>${movie.title}</h3>
            <button class="heart-btn">♥</button>
        `;
        container.appendChild(card);
    });
}

displayFavorites();

function displayRecentlyWatched(){
    const recentlyWatched = JSON.parse(localStorage.getItem("recentlyWatched")) || [];
    const container = document.querySelector(".cw1");
    container.innerHTML = "";
    recentlyWatched.forEach(movie => {
        const card = document.createElement("div");
        card.className = "movie-card";
        card.innerHTML = `
            <div class="poster-case">
                <img src="${imageBaseURL}${movie.poster}" alt="${movie.title}">
            </div>
            <h3>${movie.title}</h3>
            <div class="progress-bar">
                <div class="progress" style="width: ${movie.progress}%"></div>
            </div>
        `;
        container.appendChild(card);
    });
}
function fetchTrailer(movieId) {
    fetch(baseURL + "/movie/" + movieId + "/videos?api_key=" + apiKey)
    .then(response => response.json())
    .then(data => {
        const trailer = data.results.find(v => v.type === "Trailer" && v.site === "YouTube");
        if (trailer) {
            const screen = document.getElementById("tv-screen");
            screen.src = "https://www.youtube.com/embed/" + trailer.key + "?autoplay=1&mute=1";
        }
    });
}

displayRecentlyWatched();