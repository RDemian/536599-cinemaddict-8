import createDomElement from './create-dom-element';
import Component from './component.js';
import moment from 'moment';
import 'moment-duration-format';
moment.locale(`ru`);

const KEY_ENTER_CODE = 13;
class filmDetails extends Component {
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

    this._age = data.age;
    this._original = data.original;
    this._score = data.score;
    this._inWatchList = data.inWatchList;
    this._isWatched = data.isWatched;
    this._isFavorite = data.isFavorite;

    this._onDetailsClose = null;
    this._onCloseClick = this._onCloseClick.bind(this);

    this._onCommentAdd = null;
    this._onCommentKeyDown = this._onCommentKeyDown.bind(this);

    this._onScoreChange = null;
    this._onScoreClick = this._onScoreClick.bind(this);

    this._onEmojiClick = this._onEmojiClick.bind(this);

    this._onAddToWatchList = null;
    this._onAddToWatchListClick = this._onAddToWatchListClick.bind(this);

    this._onMarkAsWatched = null;
    this._onMarkAsWatchedClick = this._onMarkAsWatchedClick.bind(this);
  }

  get template() {
    return `
    <section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="images/posters/${this._poster}" alt="incredables-2">

            <p class="film-details__age">${this._age}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${this._title}</h3>
                <p class="film-details__title-original">Original: ${this._original}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${this._rating}</p>
                <p class="film-details__user-rating">Your rate ${this._score}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">Brad Bird</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">Brad Bird</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">Samuel L. Jackson, Catherine Keener, Sophia Bush</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${moment(this._year).format(`DD MMMM YYYY`)} (USA)</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell"> ${moment.duration(this._duration, `minutes`).format(`mm [мин]`)} </td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">USA</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  ${this._genre.map((el) => `<span class="film-details__genre">${el}</span>`).join(` `)}
                </td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${this._description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._inWatchList ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._isWatched ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>

        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${this._comments.map((el) => `
            <li class="film-details__comment">
              <span class="film-details__comment-emoji">${ {sleeping: `😴`, neutralface: `😐`, grinning: `😀`}[el.emoji.replace(`-`, ``)] }</span>
              <div>
                <p class="film-details__comment-text">${el.text}</p>
                <p class="film-details__comment-info">
                  <span class="film-details__comment-author">${el.auth}</span>
                  <span class="film-details__comment-day">${moment(el.date).fromNow()}</span>
                </p>
              </div>
            </li>`).join(` `)}
          </ul>

          <div class="film-details__new-comment">
            <div>
              <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
              <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">😴</label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-neutral-face" value="neutral-face" checked>
                <label class="film-details__emoji-label" for="emoji-neutral-face">😐</label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-grinning" value="grinning">
                <label class="film-details__emoji-label" for="emoji-grinning">😀</label>
              </div>
            </div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here (ctrl + enter)" name="comment"></textarea>
            </label>
          </div>
        </section>

        <section class="film-details__user-rating-wrap">
          <div class="film-details__user-rating-controls">
            <span class="film-details__watched-status film-details__watched-status--active">Already watched</span>
            <button class="film-details__watched-reset" type="button">undo</button>
          </div>

          <div class="film-details__user-score">
            <div class="film-details__user-rating-poster">
              <img src="images/posters/blackmail.jpg" alt="film-poster" class="film-details__user-rating-img">
            </div>

            <section class="film-details__user-rating-inner">
              <h3 class="film-details__user-rating-title">${this._title}</h3>

              <p class="film-details__user-rating-feelings">How you feel it?</p>

              <div class="film-details__user-rating-score">
                ${ new Array(9).fill().map((el, ind) => `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" ${+this._score === ind + 1 ? `checked` : ``} value="${ind + 1}" id="rating-${ind + 1}">
                          <label class="film-details__user-rating-label" for="rating-${ind + 1}">${ind + 1}</label>`).join(` `) }
              </div>
            </section>
          </div>
        </section>
      </form>
    </section>
    `.trim();
  }

  /* Закрытие попапа */
  set onDetailsClose(fn) {
    this._onDetailsClose = fn;
  }

  _onCloseClick(evt) {
    evt.preventDefault();
    return (typeof this._onDetailsClose === `function`) && this._onDetailsClose();
  }

  set onAddToWatchList(fn) {
    this._onAddToWatchList = fn;
  }
  set onMarkAsWatched(fn) {
    this._onMarkAsWatched = fn;
  }

  _onAddToWatchListClick(evt) {
    evt.preventDefault();
    return (typeof this._onAddToWatchList === `function`) && this._onAddToWatchList();
  }
  _onMarkAsWatchedClick(evt) {
    evt.preventDefault();
    return (typeof this._onMarkAsWatched === `function`) && this._onMarkAsWatched();
  }

  /* Добавление комментариев */
  set onCommentAdd(fn) {
    this._onCommentAdd = fn;
  }

  static convertCommentData(formData) {
    const entryObj = {
      emoji: ``,
      text: ``,
      auth: `добавлен мной`,
      date: new Date(),
    };

    const mapper = {
      commentemoji: (value) => {
        entryObj.emoji = value;
      },
      comment: (value) => {
        entryObj.text = value;
      },
      score: () => {},
    };
    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (mapper[property.replace(`-`, ``)]) {
        mapper[property.replace(`-`, ``)](value);
      }
    }
    return entryObj;
  }

  _commentsUpdate() {
    let newDomElement = createDomElement(this.template);
    newDomElement = newDomElement.querySelector(`.film-details__comments-list .film-details__comment:last-of-type`);
    this._element.querySelector(`.film-details__comments-list`).appendChild(newDomElement);
    this._element.querySelector(`.film-details__comments-count`).textContent = this._comments.length;
  }

  _onCommentKeyDown(evt) {
    if (evt.keyCode === KEY_ENTER_CODE && evt.ctrlKey) {
      evt.preventDefault();
      let formData = new FormData(this._element.querySelector(`.film-details__inner`));
      this._element.querySelector(`.film-details__comment-input`).value = ``;
      this._element.querySelector(`.film-details__add-emoji-label`).textContent = `😐`;
      let newComment = filmDetails.convertCommentData(formData);
      this._comments.push(newComment);
      if (newComment.text === ``) {
        return false;
      }
      this._commentsUpdate();
      return (typeof this._onCommentAdd === `function`) && this._onCommentAdd(newComment);
    }
    return false;
  }
  /* Изменение оценки */
  set onScoreChange(fn) {
    this._onScoreChange = fn;
  }

  _onScoreClick() {
    let formData = new FormData(this._element.querySelector(`.film-details__inner`));
    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (property === `score`) {
        this._score = value;
        this._rating = this._rating > value ? Math.round((this._rating - value / 10) * 10) / 10 : Math.round((this._rating + value / 10) * 10) / 10;
        this._element.querySelector(`.film-details__total-rating`).textContent = this._rating;
        this._element.querySelector(`.film-details__user-rating`).textContent = `Your rate ${this._score}`;
        let newData = {
          score: this._score,
          rating: this._rating,
        };
        return (typeof this._onScoreChange === `function`) && this._onScoreChange(newData);
      }
    }
    return false;
  }

  /* Выбор эмодзи */
  _onEmojiClick(el) {
    this._element.querySelector(`.film-details__add-emoji-label`).textContent = el.target.textContent;
  }

  bind() {
    this._element.querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._onCloseClick);
    this._element.querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, this._onCommentKeyDown);
    this._element.querySelectorAll(`.film-details__user-rating-input`).forEach((el) => {
      el.addEventListener(`click`, this._onScoreClick);
    });
    this._element.querySelectorAll(`.film-details__emoji-label`).forEach((el) => {
      el.addEventListener(`click`, this._onEmojiClick);
    });
  }

  unbind() {
    this._element.querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._onCloseClick);
    this._element.querySelector(`.film-details__comment-input`)
      .removeEventListener(`keydown`, this._onCommentKeyDown);
    this._element.querySelectorAll(`.film-details__user-rating-input`).forEach((el) => {
      el.removeEventListener(`click`, this._onScoreClick);
    });
    this._element.querySelectorAll(`.film-details__emoji-label`).forEach((el) => {
      el.removeEventListener(`click`, this._onEmojiClick);
    });
  }

  updateData(data) {
    this._title = data.title;
    this._rating = data.rating;
    this._year = data.year;
    this._duration = data.duration;
    this._genre = data.genre;
    this._poster = data.poster;
    this._description = data.description;
    this._comments = Array.from(data.comments);

    this._age = data.age;
    this._original = data.original;
    this._score = data.score;
    this._inWatchList = data.inWatchList;
    this._isWatched = data.isWatched;
    this._isFavorite = data.isFavorite;
  }
}

export default filmDetails;
