import ModelFilm from './model-film';

const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

class Provider {
  constructor({api, store, generateId}) {
    this._api = api;
    this._store = store;
    this._generateId = generateId;
    this._needSync = false;
  }

  getFilms() {
    if (this._isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          films.map((it) => this._store.setItem({key: it.id, item: it.toRAW()}));
          return films;
        });
    } else {
      const rawFilmsMap = this._store.getAll();
      const rawFilms = objectToArray(rawFilmsMap);
      const films = ModelFilm.parseFilms(rawFilms);
      return Promise.resolve(films);
    }
  }

  updateFilm({id, data}) {
    if (this._isOnline()) {
      return this._api.updateFilm({id, data})
      .then((film) => {
        this._store.setItem({key: film.id, item: film.toRAW()});
        return film;
      });
    } else {
      const film = data;
      this._needSync = true;
      this._store.setItem({key: film.id, item: film});
      return Promise.resolve(ModelFilm.parseFilm(film));
    }
  }

  syncFilms() {
    return this._api.syncFilms({films: objectToArray(this._store.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}

export default Provider;
