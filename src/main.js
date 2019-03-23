import FilmDetails from './film-details.js';
import Film from './film.js';
import Filter from './filter.js';
import Statistic from './statistic.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

/* случайное целое число в диапазоне */
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
/* Фильтры */
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

/* Генерация массива карточек filmArray */
const getObjComment = () => {
  return {
    emoji: [`sleeping`, `neutral-face`, `grinning`][Math.floor(Math.random() * 3)],
    text: [
      `Cras aliquet varius magna, non porta ligula feugiat eget.`,
      `Fusce tristique felis at fermentum pharetra.`,
      `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
      `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
      `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
      `Sed sed nisi sed augue convallis suscipit in sed felis.`,
      `Aliquam erat volutpat.`,
      `Nunc fermentum tortor ac porta dapibus.`,
      `In rutrum ac purus sit amet tempus.`
    ].filter(() => [true, false][Math.floor(Math.random() * 2)]).slice(0, getRandomInt(1, 2)).join(` `),
    auth: [
      `Ваня`,
      `Петя`,
      `Федя`][Math.floor(Math.random() * 3)],
    date: new Date(2005, 11, 12),
  };
};

const createFilmArray = (count) => {
  const filmArray = [];
  for (let i = 0; i < count; i += 1) {
    const dataObj = {};
    dataObj.title = [
      `Accused`,
      `Blackmail`,
      `Blue blazers`,
      `Fuga da New-york`,
      `Moonrise`,
      `Three friends`][Math.floor(Math.random() * 6)];
    dataObj.rating = getRandomInt(1, 9) + getRandomInt(1, 9) / 10;
    dataObj.score = getRandomInt(1, 9);
    dataObj.year = new Date([
      2016,
      2017,
      2018][Math.floor(Math.random() * 3)], getRandomInt(0, 11), getRandomInt(0, 28));
    dataObj.duration = getRandomInt(60, 110);
    dataObj.genre = new Array(1).fill().map(() => [`Sci-Fi`, `Animation`, `Fantasy`, `Comedy`, `TV Series`][Math.floor(Math.random() * 3)]);
    dataObj.poster = `${[
      `accused`,
      `blackmail`,
      `blue-blazes`,
      `fuga-da-new-york`,
      `moonrise`,
      `three-friends`][Math.floor(Math.random() * 6)]}.jpg`;
    dataObj.description = [
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.`,
      `Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.`,
      `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
      `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
      `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
      `Sed sed nisi sed augue convallis suscipit in sed felis.`,
      `Aliquam erat volutpat.`,
      `Nunc fermentum tortor ac porta dapibus.`,
      `In rutrum ac purus sit amet tempus.`
    ].filter(() => [true, false][Math.floor(Math.random() * 1.9)]).slice(0, getRandomInt(1, 3));
    dataObj.comments = new Array(getRandomInt(1, 3)).fill().map(() => getObjComment());
    dataObj.age = getRandomInt(0, 18);
    dataObj.original = [
      `Обвиняемый`,
      `Черное письмо`,
      `Голубые пиджаки`,
      `Фуга Нью-Йорк`,
      `Восход луны`,
      `Три друга`][Math.floor(Math.random() * 6)];
    dataObj.inWatchList = [true, false][Math.floor(Math.random() * 1.9)];
    dataObj.isWatched = [true, false][Math.floor(Math.random() * 1.9)];
    dataObj.isFavorite = [true, false][Math.floor(Math.random() * 1.9)];

    filmArray.push(dataObj);
  }
  return filmArray;
};

const filmArray = createFilmArray(10);
const filmListContainer = document.querySelector(`.films-list .films-list__container`);
const filmListExtraContainers = document.querySelectorAll(`.films-list--extra .films-list__container`);
const filterContainer = document.querySelector(`.main-navigation`);
const mainContainer = document.body.querySelector(`main`);

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
      filmDetailInstance.onCommentAdd = (newComment) => {
        currentData.comments.push(newComment);
        filmInstance.update(currentData);
      };
      filmDetailInstance.onScoreChange = (newData) => {
        Object.assign(currentData, newData);
        filmInstance.update(currentData);
      };
    };
    /* Добавление в списки фильтрации */
    filmInstance.onAddToWatchList = () => {
      currentData.inWatchList = !currentData.inWatchList;
      filmDetailInstance.updateData(currentData);
    };
    filmInstance.onMarkAsWatched = () => {
      currentData.isWatched = !currentData.isWatched;
      filmDetailInstance.updateData(currentData);
    };
  }
};
/* Рендер фильтров */
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

const renderFilter = (container, arr) => {
  const filmBlock = document.querySelector(`.films`);
  const statisticBlock = document.querySelector(`.statistic`);
  for (let i = arr.length - 1; i > -1; i -= 1) {
    const currentFilterData = arr[i];
    const filterInstance = new Filter(currentFilterData);
    container.prepend(filterInstance.render());
    filterInstance.onFilter = () => {
      const filteredArray = createFilteredArray(currentFilterData.name, filmArray);
      filmBlock.classList.remove(`visually-hidden`);
      statisticBlock.classList.contains(`visually-hidden`) || statisticBlock.classList.add(`visually-hidden`);
      renderCardArray(filmListContainer, filteredArray);
    };
  }
};

/* Рендер статистики*/
const initChart = (statisticCtx, watchGenre) => {
  // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
  const BAR_HEIGHT = 50;
  statisticCtx.height = BAR_HEIGHT * 5;
  const myChart = new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(watchGenre),
      datasets: [{
        data: Object.values(watchGenre),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });

  return myChart;
};

const getStaticData = () => {
  const staticData = {
    youWatched: 0,
    duration: 0,
    watchGenre: {},
    topGenre: ``,
  };

  filmArray.forEach((el) => {
    el.isWatched && (staticData.youWatched += 1) && (staticData.duration += el.duration);
    Object.is(staticData.watchGenre[el.genre], undefined) ? staticData.watchGenre[el.genre] = 1 : staticData.watchGenre[el.genre] += 1;
  });

  staticData.topGenre = Object.entries(staticData.watchGenre);
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

const renderStatistic = () => {
  const staticData = getStaticData();
  const statisticInstance = new Statistic(staticData);
  mainContainer.appendChild(statisticInstance.render());

  const filmBlock = document.querySelector(`.films`);
  const statisticBlock = document.querySelector(`.statistic`);
  const statisticCtx = statisticBlock.querySelector(`.statistic__chart`);
  statisticInstance.showStatistic = () => {
    filmBlock.classList.contains(`visually-hidden`) || filmBlock.classList.add(`visually-hidden`);
    statisticBlock.classList.remove(`visually-hidden`);
    initChart(statisticCtx, staticData.watchGenre);
  };
};

renderCardArray(filmListContainer, filmArray);
renderStatistic();
renderFilter(filterContainer, filterDataArray);


for (let container of filmListExtraContainers) {
  const extraFilmArray = Array.from(filmArray);
  extraFilmArray.length = 2;
  renderCardArray(container, extraFilmArray);
}
