import createDomElement from './create-dom-element';
import Component from './component.js';
import moment from 'moment';
import 'moment-duration-format';
const DESCRIPTION_MAX_LENGTH = 140;
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
    this._inWatchList = data.inWatchList;
    this._isWatched = data.isWatched;
    this._isFavorite = data.isFavorite;
    this._watchingDate = data.watchingDate;

    this._onDetailsDisplay = null;
    this._onCommentsClick = this._onCommentsClick.bind(this);

    this._onAddToFilterList = null;
    this._onControlClick = this._onControlClick.bind(this);
  }

  get template() {
    return `
    <article class="film-card">
    <h3 class="film-card__title">${this._title}</h3>
    <p class="film-card__rating">${this._rating}</p>
    <p class="film-card__info">
    <span class="film-card__year">${moment(this._year).format(`YYYY`)}</span>
    <span class="film-card__duration">${moment.duration(this._duration, `minutes`).format(`h [:] mm`)}</span>
    </br>
    ${this._genre.map((el) => `<span class="film-details__genre">${el}</span>`).join(` `)}
    </p>
    <img src="${this._poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${this._description.substring(0, DESCRIPTION_MAX_LENGTH)}</p>
    <button class="film-card__comments">${this._comments.length} comments</button>

    <form class="film-card__controls">
      <button data-id="inWatchList" class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${this._inWatchList ? `film-card__controls-item--active` : ``}"><!--Add to watchlist--> WL</button>
      <button data-id="isWatched" class="film-card__controls-item button film-card__controls-item--mark-as-watched ${this._isWatched ? `film-card__controls-item--active` : ``}"><!--Mark as watched-->WTCHD</button>
      <button data-id="isFavorite" class="film-card__controls-item button film-card__controls-item--favorite ${this._isFavorite ? `film-card__controls-item--active` : ``}"><!--Mark as favorite-->FAV</button>
    </form>
  </article>
  `.trim();
  }

  set onDetailsDisplay(fn) {
    this._onDetailsDisplay = fn;
  }
  set onAddToFilterList(fn) {
    this._onAddToFilterList = fn;
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
    this._inWatchList = data.inWatchList;
    this._isWatched = data.isWatched;
    this._isFavorite = data.isFavorite;

    const container = this._element.parentElement;
    const newElement = createDomElement(this.template);
    container.replaceChild(newElement, this._element);
    this._element = newElement;
    this.bind();
  }

  _onCommentsClick(evt) {
    evt.preventDefault();
    return (typeof this._onDetailsDisplay === `function`) && this._onDetailsDisplay();
  }
  _onControlClick(evt) {
    evt.preventDefault();
    return (typeof this._onAddToFilterList === `function`) && this._onAddToFilterList(evt.target.dataset.id);
  }

  bind() {
    this._element.querySelector(`.film-card__comments`)
        .addEventListener(`click`, this._onCommentsClick);
    this._element.querySelectorAll(`.film-card__controls-item`).forEach((el) => {
      el.addEventListener(`click`, this._onControlClick);
    });
  }

  unbind() {
    this._element.querySelector(`.film-card__comments`)
        .removeEventListener(`click`, this._onCommentsClick);
    this._element.querySelectorAll(`.film-card__controls-item`).forEach((el) => {
      el.addEventListener(`click`, this._onControlClick);
    });
  }
}

export default Film;
