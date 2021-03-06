import createDomElement from './create-dom-element';

class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate BaseComponent, only concrete one.`);
    }
    this._element = null;
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  render() {
    this._element = createDomElement(this.template);
    this.bind();
    return this._element;
  }

  unrender() {
    if (this._element) {
      this.unbind();
      this._element = null;
    }
  }

  update() {}

  bind() {}

  unbind() {}
}

export default Component;
