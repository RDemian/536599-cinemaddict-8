import createDomElement from './create-dom-element.js';

class Film {
  constructor(data) {
    this._title = data.title;
    this._rating = data.rating;
    this._year = data.year;
    this._duration = data.duration;
    this._genre = data.genre;
    this._poster = data.poster;
    this._description = data.description;
    this._commentCount = data.commentCount;

    this._element = null;
    this._onDetailsDisplay = null;
    this._onCommentsClick = this._onCommentsClick.bind(this);
  }

  get template() {
    return `
    <article class="film-card">
    <h3 class="film-card__title">${this._title}</h3>
    <p class="film-card__rating">${this._rating}</p>
    <p class="film-card__info">
    <span class="film-card__year">${this._year}</span>
    <span class="film-card__duration">${this._duration}</span>
    </br>
    ${this._genre.map((el) => `<span class="film-details__genre">${el}</span>`).join(` `)}
    </p>
    <img src="./images/posters/${this._poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${this._description}</p>
    <button class="film-card__comments">${this._commentCount} comments</button>

    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"><!--Add to watchlist--> WL</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"><!--Mark as watched-->WTCHD</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite"><!--Mark as favorite-->FAV</button>
    </form>
  </article>
  `.trim();
  }

  unrender() {
    this.unbind();
    this._element = null;
  }

  set onDetailsDisplay(fn) {
    this._onDetailsDisplay = fn;
  }

  _onCommentsClick(evt) {
    evt.preventDefault();
    return (typeof this._onDetailsDisplay === `function`) && this._onDetailsDisplay();
  }

  bind() {
    this._element.querySelector(`.film-card__comments`)
        .addEventListener(`click`, this._onCommentsClick);
  }

  unbind() {
    this._element.querySelector(`.film-card__comments`)
        .removeEventListener(`click`, this._onCommentsClick);
  }

  unrender() {
    if (this._element) {
      this.unbind();
      this._element.parentNode.removeChild(this._element);
      this._element = null;
    }
  }

  render() {
    this.unrender();
    this._element = createDomElement(this.template);
    this.bind();
    return this._element;
  }
}

export default Film;
