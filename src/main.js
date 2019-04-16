import FilmDetails from './film-details.js';
import Film from './film.js';
import Filter from './filter.js';
import Statistic from './statistic.js';
import API from './api.js';
import Store from './store.js';
import Provider from './provider.js';
import Search from './search.js';
import ArrayIterator from './array-iterator.js';
import getUserRank from './get-user-rank.js';

const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;
const AUTHORIZATION = `Basic eo0w590ik1111${Math.round(Math.random() * 10)}a`;
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

const createFilteredArray = (filterName, array) => {
  filterName = filterName.replace(` `, `-`).toLowerCase();
  const mapper = {
    'all-movies': () => true,
    'watchlist': (item) => item.inWatchList,
    'history': (item) => item.isWatched,
    'favorites': (item) => item.isFavorite,
  };

  return array.filter(mapper[filterName]);
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
/* Массив найденных фильмов */
const createSearchArray = (searchValue, array) => {
  return array.filter((el) => {
    return ~el.title.toLowerCase().indexOf(searchValue.toLowerCase());
  });
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
const renderFilter = (container, array) => {

  array.reverse();
  for (const name of array) {
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

const createAddToFilterListHandler = (currentData, filmInstance, filmDetailInstance) => {
  return (filterName) => {
    currentData[filterName] = !currentData[filterName];
    updateFilterCount(filterName);
    filmInstance.update(currentData);
    filmDetailInstance.updateData(currentData);
    if (satisfyCurrentFilter(filterName) && !currentData[filterName]) {
      filmInstance.element.remove();
      filmInstance.unrender();
    }
    if (filterName === `isWatched`) {
      profileRatingEl.textContent = getUserRank(filmArray);
    }
  };
};

const createFilmDetailsDisplayHandler = (currentData, filmInstance, filmDetailInstance) => {
  return () => {
    const addToFilterListHandler = createAddToFilterListHandler(currentData, filmInstance, filmDetailInstance);
    const prevPopup = document.body.querySelector(`.film-details`);

    if (prevPopup) {
      prevPopup.remove();
    }

    document.body.appendChild(filmDetailInstance.render());

    filmDetailInstance.onAddToFilterList = addToFilterListHandler;

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
  };
};
/* Рендер карточек фильмов */
const renderCardArray = (container, array) => {
  for (const it of array) {
    const currentData = it;
    const filmInstance = new Film(currentData);
    const filmDetailInstance = new FilmDetails(currentData);
    const addToFilterListHandler = createAddToFilterListHandler(currentData, filmInstance, filmDetailInstance);
    const filmDetailsDisplayHandler = createFilmDetailsDisplayHandler(currentData, filmInstance, filmDetailInstance);

    container.appendChild(filmInstance.render());
    /* Добавление в списки фильтрации */
    filmInstance.onAddToFilterList = addToFilterListHandler;
    /* При Клике по комментариям открывается детальная карточка */
    filmInstance.onDetailsDisplay = filmDetailsDisplayHandler;
  }
};
/* Рендер части карточек фильмов */
const renderPartialCardArray = (container, array) => {
  const renderNextPart = () => {
    renderCardArray(container, arrayIterator.getNextPart());
    if (arrayIterator.done) {
      showMoreBtn.classList.add(`visually-hidden`);
      arrayIterator.unbind();
      arrayIterator = null;
    }
  };

  container.innerHTML = ``;
  if (showMoreBtn.classList.contains(`visually-hidden`)) {
    showMoreBtn.classList.remove(`visually-hidden`);
  }
  if (arrayIterator) {
    arrayIterator.unbind();
  }
  arrayIterator = new ArrayIterator({array, activateElem: showMoreBtn});
  renderNextPart();

  if (arrayIterator) {
    arrayIterator.bind();
    arrayIterator.onDisplayNext = renderNextPart;
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
    profileRatingEl.textContent = getUserRank(filmArray);
    footerStatisticsEl.textContent = `${filmArray.length} movies inside`;
    filmListContainer.textContent = ``;
    renderPartialCardArray(filmListContainer, filmArray);
    document.querySelector(`.main-navigation__item--additional`).addEventListener(`click`, renderStatistic);
    document.querySelector(`.header__logo`).after(renderSearch());
    renderFilter(filterContainer, filterNameArray);

    movies.sort((a, b) => a.rating < b.rating ? 1 : -1);
    renderCardArray(topRated, [movies[0], movies[1]]);
    movies.sort((a, b) => a.comments.length < b.comments.length ? 1 : -1);
    renderCardArray(mostComented, [movies[0], movies[1]]);
  })
  .catch(() => {
    filmListContainer.textContent = `Something went wrong while loading movies. Check your connection or try again later`;
  });

