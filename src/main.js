import FilmDetails from './film-details.js';
import Film from './film.js';
import Filter from './filter.js';
import Statistic from './statistic.js';
import API from './api.js';
import Store from './store';
import Provider from './provider';


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

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});
window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  provider.syncFilms();
});

/* Даныне для фильтров */
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
    'favorites': (item) => item.isFavorites,
  };

  const filteredArray = arr.filter(mapper[filterName]);
  return filteredArray;
};
/* Подготовка данных для блока статистики */
const getStaticData = () => {
  const staticData = {
    youWatched: 0,
    duration: 0,
    chartData: {},
    topGenre: ``,
  };

  filmArray.forEach((el) => {
    if (el.isWatched) {
      staticData.youWatched += 1;
      staticData.duration += el.duration;

      if (Object.is(staticData.chartData[el.genre], undefined)) {
        staticData.chartData[el.genre] = 1;
      } else {
        staticData.chartData[el.genre] += 1;
      }
    }
  });

  staticData.topGenre = Object.entries(staticData.chartData);
  staticData.topGenre = staticData.topGenre.reduce((maxEl, el) => {
    /* el содержит массив вида ['genre', count] */
    if (el[1] > maxEl[1]) {
      maxEl = el;
    }
    return maxEl;
  });
  staticData.topGenre = staticData.topGenre[0];
  return staticData;
};

let currentFilterName = ``;

const satisfyCurrentFilter = (name) => {
  const mapper = {
    inWatchList: `Watchlist`,
    isWatched: `History`,
    all: `All movies`,
    isFavorites: `Favorites`,
  };
  return mapper[name] === currentFilterName;
};

/* Основной модуль */
let filmArray;
const filmListContainer = document.querySelector(`.films-list .films-list__container`);
const filmListExtraContainers = document.querySelectorAll(`.films-list--extra .films-list__container`);
const filterContainer = document.querySelector(`.main-navigation`);
const mainContainer = document.body.querySelector(`main`);

/* Рендер статистики*/
const renderStatistic = () => {
  const statisticInstance = new Statistic(getStaticData());
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
            filmDetailInstance.commentsUpdate(newComment);
            filmInstance.update(newFilm);
          })
          .catch(() => {
            filmDetailInstance.addErrorStyle(errorElement);
            filmDetailInstance.commentsUpdate();
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
    };
  }
};

filmListContainer.textContent = `Loading movies...`;

provider.getFilms()
  .then((movies) => {
    filmArray = movies;
    filmListContainer.textContent = ``;
    renderCardArray(filmListContainer, movies);
    document.querySelector(`.main-navigation__item--additional`).addEventListener(`click`, renderStatistic);
    renderFilter(filterContainer, filterDataArray);

    for (let container of filmListExtraContainers) {
      const extraFilmArray = Array.from(movies);
      extraFilmArray.length = 2;
      renderCardArray(container, extraFilmArray);
    }
  })
  .catch(() => {
    filmListContainer.textContent = `Something went wrong while loading movies. Check your connection or try again later`;
  });

