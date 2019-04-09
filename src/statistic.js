import Component from './component';
import createDomElement from './create-dom-element';
import moment from 'moment';
import 'moment-duration-format';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
class Statistic extends Component {
  constructor(filmArray) {
    super();
    this._filmArray = filmArray;
    this._youWatched = null;
    this._duration = null;
    this._topGenre = null;
    this._chartData = null;
    this._myChart = null;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  get template() {
    return `
    <section class="statistic visually-hidden">
      <p class="statistic__rank">Your rank <span class="statistic__rank-label">Sci-Fighter</span></p>
    
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
    
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>
    
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>
    
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>
    
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>
    
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>
    
      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${this._youWatched} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${Math.floor(this._duration / 60)}
            <span class="statistic__item-description">h</span> ${this._duration - (Math.floor(this._duration / 60) * 60)} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${this._topGenre}</p>
        </li>
      </ul>
    
      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`.trim();
  }

  _initChart() {
    // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
    const statisticCtx = this._element.querySelector(`.statistic__chart`);

    const BAR_HEIGHT = 50;
    statisticCtx.height = BAR_HEIGHT * this._chartData.size;
    const myChart = new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: Array.from(this._chartData.keys()),
        datasets: [{
          data: Array.from(this._chartData.values()),
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
  }
  /* Подготовка данных для блока статистики */
  _getStaticData(arr) {
    const staticData = {
      youWatched: 0,
      duration: 0,
      chartData: new Map(),
      topGenre: ``,
    };

    arr.forEach((el) => {
      if (el.isWatched) {
        staticData.youWatched += 1;
        staticData.duration += el.duration;

        let mapKey = el.genre.join(`, `);

        if (staticData.chartData.has(mapKey)) {
          staticData.chartData.set(mapKey, staticData.chartData.get(mapKey) + 1);
        } else {
          staticData.chartData.set(mapKey, 1);
        }
      }
    });

    if (staticData.chartData.size > 0) {
      staticData.topGenre = Array.from(staticData.chartData.entries());
      staticData.topGenre = staticData.topGenre.reduce((maxEl, el) => {
        /* el содержит массив вида ['genre', count] */
        if (el[1] > maxEl[1]) {
          maxEl = el;
        }
        return maxEl;
      });
      staticData.topGenre = staticData.topGenre[0];
    }

    this._youWatched = staticData.youWatched;
    this._duration = staticData.duration;
    this._topGenre = staticData.topGenre;
    this._chartData = staticData.chartData;
  }

  _getFilterArray(filterName) {

    if (filterName === `all-time`) {
      return this._filmArray;
    }

    const mapPeriod = {
      today: `days`,
      week: `weeks`,
      month: `months`,
      year: `years`,
    };

    const backDate = moment(new Date()).add(-1, mapPeriod[filterName]);

    return this._filmArray.filter((el) => {
      return el.watchingDate >= backDate;
    });
  }

  _updateTextList() {
    let newList = createDomElement(this.template);
    newList = newList.querySelector(`.statistic__text-list`);
    this._element.replaceChild(newList, this._element.querySelector(`.statistic__text-list`));
  }

  render() {
    this._getStaticData(this._filmArray);
    super.render();
    this._myChart = this._initChart();
    return this._element;
  }

  unrender() {
    super.unrender();
    this._myChart = null;
  }

  _onFilterChange(evt) {
    evt.preventDefault();
    const filterName = evt.target.value;
    const filterArr = this._getFilterArray(filterName);
    this._getStaticData(filterArr);
    this._myChart = null;
    this._myChart = this._initChart();
    this._updateTextList();
  }

  bind() {
    this._element.querySelectorAll(`.statistic__filters-input`).forEach((el) => {
      el.addEventListener(`change`, this._onFilterChange);
    });
  }

  unbind() {
    this._element.querySelectorAll(`.statistic__filters-input`).forEach((el) => {
      el.removeEventListener(`change`, this._onFilterChange);
    });
  }
}

export default Statistic;
