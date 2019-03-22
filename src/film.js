import createDomElement from './create-dom-element';
import Component from './component.js';
import moment from 'moment';
import 'moment-duration-format';
moment.locale(`ru`);
class Film extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._rating = data.rating;
    this._year = data.year;
    this._duration = data.duration;
    this._genre = data.genre;
    this._poster = data.poster;
    this._description = data.description;
    this._comments = Array.from(data.comments);

    this._onDetailsDisplay = null;
    this._onCommentsClick = this._onCommentsClick.bind(this);

    this._onAddToWatchList = null;
    this._onAddToWatchListClick = this._onAddToWatchListClick.bind(this);

    this._onMarkAsWatched = null;
    this._onMarkAsWatchedClick = this._onMarkAsWatchedClick.bind(this);
  }

  get template() {
    return `
    <article class="film-card">
    <h3 class="film-card__title">${this._title}</h3>
    <p class="film-card__rating">${this._rating}</p>
    <p class="film-card__info">
    <span class="film-card__year">${moment(this._year).format(`YYYY`)}</span>
    <span class="film-card__duration">${moment.duration(this._duration, `minutes`).format(`h [час] mm [мин]`)}</span>
    </br>
    ${this._genre.map((el) => `<span class="film-details__genre">${el}</span>`).join(` `)}
    </p>
    <img src="./images/posters/${this._poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${this._description}</p>
    <button class="film-card__comments">${this._comments.length} comments</button>

    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"><!--Add to watchlist--> WL</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"><!--Mark as watched-->WTCHD</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite"><!--Mark as favorite-->FAV</button>
    </form>
  </article>
  `.trim();
  }

  set onDetailsDisplay(fn) {
    this._onDetailsDisplay = fn;
  }
  set onAddToWatchList(fn) {
    this._onAddToWatchList = fn;
  }
  set onMarkAsWatched(fn) {
    this._onMarkAsWatched = fn;
  }

  _onCommentsClick(evt) {
    evt.preventDefault();
    return (typeof this._onDetailsDisplay === `function`) && this._onDetailsDisplay();
  }
  _onAddToWatchListClick(evt) {
    evt.preventDefault();
    return (typeof this._onAddToWatchList === `function`) && this._onAddToWatchList();
  }
  _onMarkAsWatchedClick(evt) {
    evt.preventDefault();
    return (typeof this._onMarkAsWatched === `function`) && this._onMarkAsWatched();
  }

  bind() {
    this._element.querySelector(`.film-card__comments`)
        .addEventListener(`click`, this._onCommentsClick);
    this._element.querySelector(`.film-card__controls-item--add-to-watchlist`)
        .addEventListener(`click`, this._onAddToWatchListClick);
    this._element.querySelector(`.film-card__controls-item--mark-as-watched`)
        .addEventListener(`click`, this._onMarkAsWatchedClick);
  }

  unbind() {
    this._element.querySelector(`.film-card__comments`)
        .removeEventListener(`click`, this._onCommentsClick);
    this._element.querySelector(`.film-card__controls-item--add-to-watchlist`)
        .removeEventListener(`click`, this._onAddToWatchListClick);
    this._element.querySelector(`.film-card__controls-item--mark-as-watched`)
        .removeEventListener(`click`, this._onMarkAsWatchedClick);
  }

  update(data) {
    this._title = data.title;
    this._rating = data.rating;
    this._year = data.year;
    this._duration = data.duration;
    this._genre = data.genre;
    this._poster = data.poster;
    this._description = data.description;
    this._comments = Array.from(data.comments);
    let container = this._element.parentElement;
    let newElement = createDomElement(this.template);
    container.replaceChild(newElement, this._element);
    this._element = newElement;
    this.bind();
  }
}

export default Film;
