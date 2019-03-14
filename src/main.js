import createFilter from './filter-create';
import createCard from './card-create';
import film from './film.js';

/* случайное целое число в диапазоне */
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const filterContainer = document.querySelector(`.main-navigation`);

filterContainer.insertAdjacentHTML(`beforeend`, createFilter(`All movies`));
filterContainer.insertAdjacentHTML(`beforeend`, createFilter(`Watchlist`, getRandomInt(1, 13)));
filterContainer.insertAdjacentHTML(`beforeend`, createFilter(`History`, getRandomInt(1, 13)));
filterContainer.insertAdjacentHTML(`beforeend`, createFilter(`Favorites`, getRandomInt(1, 13)));

/* Генерация массива карточек filmArray */
const createFilmArray = (count) => {
  const filmArray = [];
  for (let i = 0; i < count; i += 1) {
    const objFilm = film();
    objFilm.title = [
      `Accused`,
      `Blackmail`,
      `Blue blazers`,
      `Fuga da New-york`,
      `Moonrise`,
      `Three friends`][Math.floor(Math.random() * 6)];
    objFilm.rating = getRandomInt(1, 9) + getRandomInt(1, 9) / 10;
    objFilm.year = [
      `2016`,
      `2017`,
      `2018`][Math.floor(Math.random() * 3)];
    objFilm.duration = `1h&nbsp;${getRandomInt(1, 59)}m`;
    objFilm.genre = `Comedy`;
    objFilm.poster = `${[
      `accused`,
      `blackmail`,
      `blue-blazes`,
      `fuga-da-new-york`,
      `moonrise`,
      `three-friends`][Math.floor(Math.random() * 6)]}.jpg`;
    objFilm.description = [
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.`,
      `Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.`,
      `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
      `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
      `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
      `Sed sed nisi sed augue convallis suscipit in sed felis.`,
      `Aliquam erat volutpat.`,
      `Nunc fermentum tortor ac porta dapibus.`,
      `In rutrum ac purus sit amet tempus.`
    ].filter(() => [true, false][Math.floor(Math.random() * 2)]).slice(0, getRandomInt(1, 3));
    objFilm.commentCount = getRandomInt(1, 20);

    filmArray.push(createCard(objFilm));
  }
  return filmArray;
};

const filmArray = createFilmArray(12);

/* выводим карточки в контейнер */
const renderCardArray = (container, arr, count) => {
  if (arr.length < count) {
    count = films.length;
  }
  let films = arr.slice(0, arr.length);
  container.innerHTML = ``;
  for (let i = 0; i < count; i += 1) {
    container.insertAdjacentHTML(`beforeend`, films.splice(getRandomInt(0, films.length - 1), 1));
  }
};

const filmList = document.querySelector(`.films-list .films-list__container`);
const filmListExtra = document.querySelectorAll(`.films-list--extra .films-list__container`);

renderCardArray(filmList, filmArray, 9);

for (let container of filmListExtra) {
  renderCardArray(container, filmArray, 2);
}

/* Обработчик клика по фильтрам */
const handlerFilterClick = () => {
  renderCardArray(filmList, filmArray, getRandomInt(1, filmArray.length));
};

filterContainer.addEventListener(`click`, handlerFilterClick);
