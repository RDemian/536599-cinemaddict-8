import Component from './component';
import createDomElement from './create-dom-element';
const INTERVAL_TIME = 200;

class Search extends Component {
  constructor() {
    super();

    this._onFilmSearch = null;
    this._onSearchInput = this._onSearchInput.bind(this);
  }

  get template() {
    return `
      <form class="header__search search">
        <input type="text" name="search" class="search__field" placeholder="Search">
        <button type="submit" class="visually-hidden">Search</button>
      </form>
    `.trim();
  }

  set onFilmSearch(fn) {
    this._onFilmSearch = fn;
  }

  searchAnimation(time = 2000) {
    const searchCtrl = this._element.querySelector(`.search__field`);
    searchCtrl.setAttribute(`autocomplete`, `off`);
    this._element.style.position = `relative`;

    const divAnim = createDomElement(`<div>.</div>`);
    divAnim.style = `
      position: absolute;
      bottom: -17px;
      left: 5px;
    `;
    searchCtrl.after(divAnim);
    const intervalId = setInterval(() => {
      divAnim.textContent += ` .`;
    }, INTERVAL_TIME);

    setTimeout(() => {
      clearInterval(intervalId);
      divAnim.remove(divAnim);
    }, time + INTERVAL_TIME);

  }

  _onSearchInput(evt) {
    evt.preventDefault();
    return (typeof this._onFilmSearch === `function`) && this._onFilmSearch(evt.target.value);
  }

  bind() {
    this._element.querySelector(`.search__field`).addEventListener(`input`, this._onSearchInput);
  }

  unbind() {
    this._element.querySelector(`.search__field`).removeEventListener(`input`, this._onSearchInput);
  }
}

export default Search;
