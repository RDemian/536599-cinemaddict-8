class ArrayIterator {
  constructor({array = [], partSize = 5, activateElem = null}) {
    this._marker = 0;
    this._array = array;
    this._partSize = partSize;
    this._done = false;
    this._activateElem = activateElem;

    this._onDisplayNext = null;
    this._onShowMoreBtnClick = this._onShowMoreBtnClick.bind(this);
  }

  get done() {
    return this._done;
  }

  set onDisplayNext(fn) {
    this._onDisplayNext = fn;
  }

  getNextPart() {
    this._marker += this._partSize;
    if (this._marker >= this._array.length) {
      this._done = true;
    }

    return this._array.slice(this._marker - this._partSize, this._marker);
  }

  _onShowMoreBtnClick(evt) {
    evt.preventDefault();
    return (typeof this._onDisplayNext === `function`) && this._onDisplayNext();
  }

  bind() {
    if (this._activateElem) {
      this._activateElem.addEventListener(`click`, this._onShowMoreBtnClick);
    }
  }

  unbind() {
    if (this._activateElem) {
      this._activateElem.removeEventListener(`click`, this._onShowMoreBtnClick);
    }
  }
}

export default ArrayIterator;
