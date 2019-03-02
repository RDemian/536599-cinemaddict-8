import createFilter from './filter-create';
import createCard from './card-create';

/* случайное целое число в диапазоне */
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const filterContainer = document.querySelector(`.main-navigation`);

filterContainer.insertAdjacentHTML(`beforeend`, createFilter(`All movies`));
filterContainer.insertAdjacentHTML(`beforeend`, createFilter(`Watchlist`, getRandomInt(1, 13)));
filterContainer.insertAdjacentHTML(`beforeend`, createFilter(`History`, getRandomInt(1, 13)));
filterContainer.insertAdjacentHTML(`beforeend`, createFilter(`Favorites`, getRandomInt(1, 13)));

const objFilm = {};
objFilm.title = `The Assassination Of Jessie James By The Coward Robert Ford`;
objFilm.rating = 9.8;
objFilm.year = `2018`;
objFilm.duration = `1h&nbsp;13m`;
objFilm.genre = `Comedy`;
objFilm.poster = `three-friends.jpg`;
objFilm.descript = `A priest with a haunted past and a novice on the threshold of her final vows are sent by the Vatican to investigate the death of a young nun in Romania and confront a malevolent force in the form of a demonic nun.`;
objFilm.commentCount = getRandomInt(1, 20);

/* создаем карточки фильмов */
const renderCard = (count) => {
  let card = ``;
  for (let i = 1; i <= count; i += 1) {
    card = card + ` ` + createCard(objFilm);
  }
  return card;
};

const filmList = document.querySelector(`.films-list .films-list__container`);
const filmListExtra = document.querySelectorAll(`.films-list--extra .films-list__container`);

filmList.innerHTML = renderCard(7);

for (let container of filmListExtra) {
  container.innerHTML = renderCard(2);
}

/* Обработчик клика по фильтрам */
const handlerFilterClick = () => {
  filmList.innerHTML = renderCard(getRandomInt(1, 13));
};

filterContainer.addEventListener(`click`, handlerFilterClick);
