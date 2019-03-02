
export default (objFilm) => `
  <article class="film-card">
    <h3 class="film-card__title">${objFilm.title}</h3>
    <p class="film-card__rating">${objFilm.rating}</p>
    <p class="film-card__info">
    <span class="film-card__year">${objFilm.year}</span>
    <span class="film-card__duration">${objFilm.duration}</span>
    <span class="film-card__genre">${objFilm.genre}</span>
    </p>
    <img src="./images/posters/${objFilm.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${objFilm.descript}</p>
    <button class="film-card__comments">${objFilm.commentCount} comments</button>

    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"><!--Add to watchlist--> WL</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"><!--Mark as watched-->WTCHD</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite"><!--Mark as favorite-->FAV</button>
    </form>
  </article>
`;
