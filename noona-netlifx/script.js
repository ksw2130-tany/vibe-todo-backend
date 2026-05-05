const API_KEY = "37f8dab1fef9c1b4f7c2d860e27c2edd";
const NOW_PLAYING_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1`;
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

const movieGrid = document.getElementById("movie-grid");
const cardTemplate = document.getElementById("movie-card-template");

function showMessage(text) {
  movieGrid.innerHTML = `<p class="message">${text}</p>`;
}

function createMovieCard(movie) {
  const cardFragment = cardTemplate.content.cloneNode(true);
  const posterElement = cardFragment.querySelector(".movie-poster");
  const titleElement = cardFragment.querySelector(".movie-title");
  const releaseDateElement = cardFragment.querySelector(".movie-release-date");

  titleElement.textContent = movie.title;
  releaseDateElement.textContent = movie.release_date
    ? `개봉: ${movie.release_date}`
    : "개봉일 정보 없음";
  posterElement.src = movie.poster_path
    ? `${POSTER_BASE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";
  posterElement.alt = `${movie.title} 포스터`;

  return cardFragment;
}

async function fetchNowPlayingMovies() {
  showMessage("영화 목록을 불러오는 중...");

  try {
    const response = await fetch(NOW_PLAYING_URL);

    if (!response.ok) {
      throw new Error("API 요청 실패");
    }

    const data = await response.json();
    const movies = data.results ?? [];

    if (movies.length === 0) {
      showMessage("현재 상영 중인 영화를 찾지 못했습니다.");
      return;
    }

    movieGrid.innerHTML = "";
    const cards = document.createDocumentFragment();

    movies.forEach((movie) => {
      cards.appendChild(createMovieCard(movie));
    });

    movieGrid.appendChild(cards);
  } catch (error) {
    showMessage("영화 데이터를 가져오지 못했습니다. 잠시 후 다시 시도해주세요.");
    console.error(error);
  }
}

fetchNowPlayingMovies();
