import Component from './component';
import moment from 'moment';
import 'moment-duration-format';
moment.locale(`ru`);
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
class Statistic extends Component {
  constructor(data) {
    super();
    this._youWatched = data.youWatched;
    this._duration = data.duration;
    this._topGenre = data.topGenre;
    this._chartData = data.chartData;

    this._myChart = null;
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
    statisticCtx.height = BAR_HEIGHT * 5;
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

  render() {
    super.render();
    this._myChart = this._initChart();
    return this._element;
  }

  unrender() {
    super.unrender();
    this._myChart = null;
  }
}

export default Statistic;
