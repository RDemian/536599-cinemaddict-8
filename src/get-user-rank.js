/* Вычислить звание пользователя */
const getUserRank = (array) => {
  let countWatchFilms = array;
  let currentRank = ``;

  if (Array.isArray(array)) {
    countWatchFilms = array.reduce((count, el) => {
      if (el.isWatched) {
        count += 1;
      }
      return count;
    }, 0);
  }

  const rank = new Map([
    [`show adept`, 0],
    [`novice`, 1],
    [`fan`, 11],
    [`movie buff`, 20],
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

export default getUserRank;
