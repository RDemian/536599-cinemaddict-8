import FilmDetails from './film-details.js';
import Film from './film.js';
import Filter from './filter.js';
import Statistic from './statistic.js';
import API from './api.js';
import Store from './store.js';
import Provider from './provider.js';
import Search from './search.js';
import ArrayIterator from './array-iterator.js';

/* случайное целое число в диапазоне */
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;
const AUTHORIZATION = `Basic eo0w590ik1111${getRandomInt(1, 9)}a`;
const FILMS_STORE_KEY = `films-store-key`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const store = new Store({key: FILMS_STORE_KEY, storage: localStorage});
const provider = new Provider({api, store, generateId: () => String(Date.now())});
const filmBlock = document.querySelector(`.films`);
const filmListContainer = document.querySelector(`.films-list .films-list__container`);
const filterContainer = document.querySelector(`.main-navigation`);
const mainContainer = document.body.querySelector(`main`);
const topRated = document.querySelector(`#top-rated-container`);
const mostComented = document.querySelector(`#most-commented-container`);
const profileRatingEl = document.querySelector(`.profile__rating`);
const footerStatisticsEl = document.querySelector(`.footer__statistics p`);
const showMoreBtn = document.querySelector(`.films-list__show-more`);
let statisticBlock;
let currentFilterName = ``;
let filmArray;
let arrayIterator = null;
/* Данные для фильтров */
const filterNameArray = [
  `All movies`,
  `Watchlist`,
  `History`,
  `Favorites`,
];

const calculateFilterCount = (filterName) => {
  if (filterName === `All movies`) {
    return 0;
  }
  return createFilteredArray(filterName, filmArray).length;
};

const updateFilterCount = (filterName) => {
  const mapper = {
    'inWatchList': `Watchlist`,
    'isWatched': `History`,
    'isFavorite': `Favorites`,
  };
  const filterElement = filterContainer.querySelector(`[href = "#${mapper[filterName].toLowerCase()}"]`);
  const count = calculateFilterCount(mapper[filterName]);
  filterElement.innerHTML = `${mapper[filterName]} ${count ? `<span class="main-navigation__item-count">${count}</span>` : ``}`;
};

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
    isFavorite: `Favorites`,
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

  for (const it of rank) {
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
      renderPartialCardArray(filmListContainer, createSearchArray(searchValue, filmArray));
    }, delayTime);
  };
  return domEl;
};
/* Рендер статистики*/
const renderStatistic = () => {
  const statisticInstance = new Statistic(filmArray);
  mainContainer.appendChild(statisticInstance.render());
  statisticBlock = document.querySelector(`.statistic`);
  if (!filmBlock.classList.contains(`visually-hidden`)) {
    filmBlock.classList.add(`visually-hidden`);
  }
  statisticBlock.classList.remove(`visually-hidden`);
};
/* Рендер фильтров */
const renderFilter = (container, arr) => {

  arr.reverse();
  for (const name of arr) {
    const filterInstance = new Filter({name, count: calculateFilterCount(name)});
    container.prepend(filterInstance.render());
    filterInstance.onFilter = () => {
      const filteredArray = createFilteredArray(name, filmArray);
      filmBlock.classList.remove(`visually-hidden`);
      statisticBlock = document.querySelector(`.statistic`);
      if (statisticBlock) {
        statisticBlock.remove();
      }
      renderPartialCardArray(filmListContainer, filteredArray);
      currentFilterName = name;
    };
  }
};
/* Рендер карточек фильмов */
const renderCardArray = (container, arr) => {
  for (const it of arr) {
    const currentData = it;
    const filmInstance = new Film(currentData);
    const filmDetailInstance = new FilmDetails(currentData);

    container.appendChild(filmInstance.render());

    /* При Клике по комментариям выполняется функция ниже */
    filmInstance.onDetailsDisplay = () => {
      const prevPopup = document.body.querySelector(`.film-details`);
      if (prevPopup) {
        prevPopup.remove();
      }
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
        updateFilterCount(filterName);
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
    };
    /* Добавление в списки фильтрации */
    filmInstance.onAddToFilterList = (filterName) => {
      currentData[filterName] = !currentData[filterName];
      updateFilterCount(filterName);
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
/* Рендер части карточек фильмов */
const renderPartialCardArray = (container, arr) => {
  container.innerHTML = ``;
  if (showMoreBtn.classList.contains(`visually-hidden`)) {
    showMoreBtn.classList.remove(`visually-hidden`);
  }
  if (arrayIterator) {
    arrayIterator.unbind();
  }
  arrayIterator = new ArrayIterator({array: arr, activateElem: showMoreBtn});
  renderCardArray(container, arrayIterator.next());
  if (arrayIterator.done) {
    showMoreBtn.classList.add(`visually-hidden`);
    arrayIterator.unbind();
    arrayIterator = null;
  } else {
    arrayIterator.bind();
    arrayIterator.displayNext = () => {
      renderCardArray(container, arrayIterator.next());
      if (arrayIterator.done) {
        showMoreBtn.classList.add(`visually-hidden`);
        arrayIterator.unbind();
        arrayIterator = null;
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
    footerStatisticsEl.textContent = `${filmArray.length} movies inside`;
    filmListContainer.textContent = ``;
    renderPartialCardArray(filmListContainer, filmArray);
    document.querySelector(`.main-navigation__item--additional`).addEventListener(`click`, renderStatistic);
    document.querySelector(`.header__logo`).after(renderSearch());
    renderFilter(filterContainer, filterNameArray);

    filmArray.sort((a, b) => a.rating < b.rating ? 1 : -1);
    renderCardArray(topRated, [filmArray[0], filmArray[1]]);
    filmArray.sort((a, b) => a.comments.length < b.comments.length ? 1 : -1);
    renderCardArray(mostComented, [filmArray[0], filmArray[1]]);
  })
  .catch(() => {
    filmListContainer.textContent = `Something went wrong while loading movies. Check your connection or try again later`;
  });

