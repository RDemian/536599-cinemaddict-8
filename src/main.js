import FilmDetails from './film-details.js';
import Film from './film.js';
import Filter from './filter.js';
import Statistic from './statistic.js';
import API from './api.js';
import Store from './store';
import Provider from './provider';
import Search from './search.js';


/* случайное целое число в диапазоне */
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;
const AUTHORIZATION = `Basic eo0w590ik1111${getRandomInt(1, 9)}a`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const FILMS_STORE_KEY = `films-store-key`;
const store = new Store({key: FILMS_STORE_KEY, storage: localStorage});
const provider = new Provider({api, store, generateId: () => String(Date.now())});
let currentFilterName = ``;
let filmArray;
const filmListContainer = document.querySelector(`.films-list .films-list__container`);
const filterContainer = document.querySelector(`.main-navigation`);
const mainContainer = document.body.querySelector(`main`);
const topRated = document.querySelector(`#top-rated-container`);
const mostComented = document.querySelector(`#most-commented-container`);
const profileRatingEl = document.querySelector(`.profile__rating`);
/* Данные для фильтров */
const filterDataArray = [
  {
    name: `All movies`,
    count: 0,
  },
  {
    name: `Watchlist`,
    count: 0,
  },
  {
    name: `History`,
    count: 0,
  },
  {
    name: `Favorites`,
    count: 0,
  },
];

const createFilteredArray = (filterName, arr) => {
  filterName = filterName.replace(` `, `-`).toLowerCase();
  const mapper = {
    'all-movies': () => true,
    'watchlist': (item) => item.inWatchList,
    'history': (item) => item.isWatched,
    'favorites': (item) => item.isFavorite,
  };

  const filteredArray = arr.filter(mapper[filterName]);
  return filteredArray;
};

const satisfyCurrentFilter = (name) => {
  const mapper = {
    inWatchList: `Watchlist`,
    isWatched: `History`,
    all: `All movies`,
    isFavorites: `Favorites`,
  };
  return mapper[name] === currentFilterName;
};
/* Вычислить звание пользователя */
const getUserRank = () => {
  const countWatchFilms = filmArray.reduce((count, el) => {
    if (el.isWatched) {
      count += 1;
    }
    return count;
  }, 0);
  let currentRank = ``;
  const rank = new Map([
    [`show adept`, 0],
    [`novice`, 1],
    [`fan`, 11],
    [`movie buff`, 21],
  ]);

  for (let it of rank) {
    if (countWatchFilms >= it[1]) {
      currentRank = it[0];
    } else {
      break;
    }
  }

  return currentRank;
};
/* Массив найденных фильмов */
const createSearchArray = (searchValue, arr) => {
  const searchArray = arr.filter((el) => {
    return ~el.title.toLowerCase().indexOf(searchValue.toLowerCase());
  });

  return searchArray;
};

/* Рендер строки поиска*/
const renderSearch = () => {
  const searchInstance = new Search();
  const domEl = searchInstance.render();
  const delayTime = 1600;
  let timerId;
  searchInstance.onFilmSearch = (searchValue) => {
    clearTimeout(timerId);
    searchInstance.searchAnimation(delayTime);
    timerId = setTimeout(() => {
      renderCardArray(filmListContainer, createSearchArray(searchValue, filmArray));
    }, delayTime);
  };
  return domEl;
};
/* Рендер статистики*/
const renderStatistic = () => {
  const statisticInstance = new Statistic(filmArray);
  mainContainer.appendChild(statisticInstance.render());

  const filmBlock = document.querySelector(`.films`);
  const statisticBlock = document.querySelector(`.statistic`);
  if (!filmBlock.classList.contains(`visually-hidden`)) {
    filmBlock.classList.add(`visually-hidden`);
  }
  statisticBlock.classList.remove(`visually-hidden`);
};
/* Рендер фильтров */
const renderFilter = (container, arr) => {
  const filmBlock = document.querySelector(`.films`);
  for (let i = arr.length - 1; i > -1; i -= 1) {
    const currentFilterData = arr[i];
    const filterInstance = new Filter(currentFilterData);
    container.prepend(filterInstance.render());
    filterInstance.onFilter = () => {
      const filteredArray = createFilteredArray(currentFilterData.name, filmArray);
      filmBlock.classList.remove(`visually-hidden`);
      const statisticBlock = document.querySelector(`.statistic`);
      if (statisticBlock) {
        statisticBlock.remove();
      }
      renderCardArray(filmListContainer, filteredArray);
      currentFilterName = currentFilterData.name;
    };
  }
};
/* Рендер карточек фильмов */
const renderCardArray = (container, arr) => {
  container.innerHTML = ``;

  for (let i = 0; i < arr.length; i += 1) {
    const currentData = arr[i];
    const filmInstance = new Film(currentData);
    const filmDetailInstance = new FilmDetails(currentData);

    container.appendChild(filmInstance.render());

    /* При Клике по комментариям выполняется функция ниже */
    filmInstance.onDetailsDisplay = () => {
      document.body.appendChild(filmDetailInstance.render());
      filmDetailInstance.onDetailsClose = () => {
        document.body.removeChild(filmDetailInstance.element);
        filmDetailInstance.unrender();
      };
      filmDetailInstance.onCommentAdd = (newComment, errorElement) => {
        currentData.comments.push(newComment);
        provider.updateFilm({id: currentData.id, data: currentData.toRAW()})
          .then((newFilm) => {
            filmDetailInstance.commentsUpdate(currentData.comments);
            filmDetailInstance.displayUndoBtn();
            filmInstance.update(newFilm);
          })
          .catch(() => {
            filmDetailInstance.addErrorStyle(errorElement);
            filmDetailInstance.commentsUpdate();
          });
      };
      filmDetailInstance.onCommentRemove = (errorElement) => {
        currentData.comments.pop();
        provider.updateFilm({id: currentData.id, data: currentData.toRAW()})
          .then((newFilm) => {
            filmDetailInstance.commentsUpdate(currentData.comments);
            filmDetailInstance.hideUndoBtn();
            filmInstance.update(newFilm);
          })
          .catch(() => {
            filmDetailInstance.addErrorStyle(errorElement);
          });
      };
      filmDetailInstance.onScoreChange = (newData, errorElement) => {
        Object.assign(currentData, newData);
        provider.updateFilm({id: currentData.id, data: currentData.toRAW()})
          .then(() => {
            filmInstance.update(currentData);
            filmDetailInstance.scoreUpdate(newData);
          })
          .catch(() => {
            filmDetailInstance.addErrorStyle(errorElement);
            filmDetailInstance.scoreUpdate();
          });
      };
      filmDetailInstance.onAddToFilterList = (filterName) => {
        currentData[filterName] = !currentData[filterName];
        filmInstance.update(currentData);
        filmDetailInstance.updateData(currentData);
        if (filterName === `isWatched`) {
          profileRatingEl.textContent = getUserRank();
        }
      };
    };
    /* Добавление в списки фильтрации */
    filmInstance.onAddToFilterList = (filterName) => {
      currentData[filterName] = !currentData[filterName];
      filmInstance.update(currentData);
      filmDetailInstance.updateData(currentData);
      if (satisfyCurrentFilter(filterName) && !currentData[filterName]) {
        filmInstance.element.remove();
        filmInstance.unrender();
      }
      if (filterName === `isWatched`) {
        profileRatingEl.textContent = getUserRank();
      }
    };
  }
};

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});

window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  provider.syncFilms();
});

filmListContainer.textContent = `Loading movies...`;

provider.getFilms()
  .then((movies) => {
    filmArray = Array.from(movies);
    profileRatingEl.textContent = getUserRank();
    filmListContainer.textContent = ``;
    renderCardArray(filmListContainer, movies);
    document.querySelector(`.main-navigation__item--additional`).addEventListener(`click`, renderStatistic);
    document.querySelector(`.header__logo`).after(renderSearch());
    renderFilter(filterContainer, filterDataArray);

    filmArray.sort((a, b) => a.rating < b.rating ? 1 : -1);
    renderCardArray(topRated, [filmArray[0], filmArray[1]]);
    filmArray.sort((a, b) => a.comments.length < b.comments.length ? 1 : -1);
    renderCardArray(mostComented, [filmArray[0], filmArray[1]]);

  })
  .catch(() => {
    filmListContainer.textContent = `Something went wrong while loading movies. Check your connection or try again later`;
  });

