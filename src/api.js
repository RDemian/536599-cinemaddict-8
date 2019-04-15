import ModelFilm from './model-film';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const toJSON = (response) => {
  return response.json();
};

class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({url: `movies`})
      .then(toJSON)
      .then((it)=>{
        return ModelFilm.parseFilms(it);
      });
  }

  updateFilm({id, data}) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelFilm.parseFilm);
  }

  syncFilms(films) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(films),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);
    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        } else {
          throw new Error(`${response.status}: ${response.statusText}`);
        }
      })
      .catch((err) => {
        throw err;
      });
  }
}

export default API;
