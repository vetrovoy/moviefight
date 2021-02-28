const autoCompleteConfig = {
  renderOption: (movie) => {
    const imgSrc = movie.Poster === "N/A" ? "" : `<img src=${movie.Poster} />`;
    return `
        ${imgSrc}
        ${movie.Title} (${movie.Year})
        `;
  },
  inputvalue: (movie) => {
    return movie.Title;
  },
  fetchData: async (searchTerm) => {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "c64c04e4",
        s: searchTerm,
      },
    });

    if (response.data.Error) {
      return [];
    }

    return response.data.Search;
  },
};
let leftMovie;
let rightMovie;
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect: (movie) => {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector('#left-summery'), 'left');
  }
});
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect: (movie) => {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summery"), 'right');
  }
});

const onMovieSelect = async (movie, summeryElement, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "c64c04e4",
      i: movie.imdbID,
    },
  });
  summeryElement.innerHTML = movieTemplate(response.data);

  if(side === 'left') {
      leftMovie = response.data;
  }else{
      rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll("#left-summery .notification");
  const rightSideStats = document.querySelectorAll("#right-summery .notification");

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    if(leftSideValue > rightSideValue){
      rightStat.classList.remove("winner");
      rightStat.classList.add("is-black");

      leftStat.classList.remove("is-black");
      leftStat.classList.add("winner");
    }else{
      leftStat.classList.remove("winner");
      leftStat.classList.add("is-black");

      rightStat.classList.remove("is-black");
      rightStat.classList.add("winner");
    }
  });
}

const movieTemplate = (movieDetail) => {
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);
        if(isNaN(value)){
            return prev;
        }else{
            return prev + value;
        }
    }, 0);
    const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
    );
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
            <img src="${movieDetail.Poster}">
            </p>
        </figure>
        <div class="media-content">
            <div class="content is-white">
            <h1>${movieDetail.Title}</h1>
            <h4>${movieDetail.Genre}</h4>
            <p>${movieDetail.Plot}</p>
            </div>
        </div>
    </article>
    <article data-value="${awards}" class="awards notification is-black">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article data-value="${dollars}" class="notification is-black">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>
    <article data-value="${metascore}" class="notification is-black">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>
    <article data-value="${imdbRating}" class="notification is-black">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value="${imdbVotes}" class="notification is-black">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>
    `;
};
