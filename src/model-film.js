class ModelFilm {
  constructor(data) {
    this.id = data.id;
    this.comments = data.comments.map((el) => {
      return {
        emoji: el.emotion,
        text: el.comment,
        auth: el.author,
        date: new Date(el.date)
      };
    });
    this.title = data.film_info.title;
    this.original = data.film_info.alternative_title;
    this.rating = data.film_info.total_rating;
    this.poster = data.film_info.poster;
    this.age = data.film_info.age_rating;
    this.director = data.film_info.director;
    this.writers = data.film_info.writers;
    this.actors = data.film_info.actors;
    this.year = new Date(data.film_info.release.date);
    this.country = data.film_info.release.release_country;
    this.duration = data.film_info.runtime;
    this.genre = data.film_info.genre;
    this.description = data.film_info.description;
    this.score = data.user_details.personal_rating;
    this.inWatchList = data.user_details.watchlist;
    this.isWatched = data.user_details.already_watched;
    this.isFavorite = data.user_details.favorite;
  }

  toRAW() {
    return {
      'comments': this.comments.map((el) => {
        return {
          emotion: el.emoji,
          comment: el.text,
          author: el.auth,
          date: el.date.getTime()
        };
      }),
      'user_details': {
        'personal_rating': this.score,
        'watchlist': this.inWatchList,
        'already_watched': this.isWatched,
        'favorite': this.isFavorite
      }
    };
  }
  static parseFilm(data) {
    return new ModelFilm(data);
  }

  static parseFilms(data) {
    const arr = data.map((el) => {
      return ModelFilm.parseFilm(el);
    });
    return arr;
  }
}

export default ModelFilm;
