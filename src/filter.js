import Component from './component.js';

class Filter extends Component {
  constructor({name, count}) {
    super();
    this._name = name;
    this._count = count;

    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  get template() {
    return `
    <a href="#${this._name.replace(` `, `-`).toLowerCase()}" class="main-navigation__item">${this._name}
        ${this._count ? `<span class="main-navigation__item-count">${this._count}</span>` : ``}
    </a>`.trim();
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  _onFilterClick(evt) {
    evt.preventDefault();
    return (typeof this._onFilter === `function`) && this._onFilter();
  }

  bind() {
    this._element.addEventListener(`click`, this._onFilterClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onFilterClick);
  }
}

export default Filter;
