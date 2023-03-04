import { Component, Input, OnInit } from '@angular/core';
import { chart, Chart } from 'highcharts';
import { HistoricalData } from '../models/Data';


@Component({
  selector: 'app-stockgraph',
  templateUrl: './stockgraph.component.html',
  styleUrls: ['./stockgraph.component.scss']
})

export class StockgraphComponent implements OnInit {

  @Input()
  public parent?: any;

  public data?: HistoricalData[];
  public series?: Highcharts.SeriesOptionsType[];

  public loaded: boolean = false;

  public chart?: Chart;

  public options: Highcharts.Options = {
    yAxis: [{
        labels: {
            align: 'left'
        },
        height: '80%',
        resize: {
            enabled: true
        }
    }, {
        labels: {
            align: 'left'
        },
        top: '80%',
        height: '20%',
        offset: 0
    }],
    tooltip: {
        shape: 'square',
        headerShape: 'callout',
        borderWidth: 0,
        shadow: false,
        positioner: function (width:any, height:any, point:any): any {
            var chart = this.chart,
                position;

            if (point.isHeader) {
                position = {
                    x: Math.max(
                        // Left side limit
                        chart.plotLeft,
                        Math.min(
                            point.plotX + chart.plotLeft - width / 2,
                            // Right side limit
                            chart.chartWidth - width
                        )
                    ),
                    y: point.plotY
                };
            } else {
                position = {
                    x: point.series.chart.plotLeft,
                    y: point.series.yAxis.top - chart.plotTop
                };
            }

            return position;
        }
    },
    series: [{
        type: 'ohlc',
        id: 'aapl-ohlc',
        name: 'AAPL Stock Price',
        data: []
    }, {
        type: 'column',
        id: 'aapl-volume',
        name: 'AAPL Volume',
        data: [],
        yAxis: 1
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 800
            },
            chartOptions: {
                rangeSelector: {
                    inputEnabled: false
                }
            }
        }]
    }
}

  constructor() {}

  ngOnInit(): void {
    this.data = this.parent?.data;
    if (this.data) this.updateData();
    this.parent.stockevent.subscribe({
      next: (res: number) => {
        if (res == 200) {
          this.data = this.parent.data;
          this.updateData();
        }
      }
    });
    this.chart = chart('chart-candlestick', this.options);
  }

  updateData() {
    if (!this.data) return;
    this.series = [];
    let candleserie: Highcharts.SeriesOptionsType = {
      type: 'ohlc',
      id: 'aapl-ohlc',
      name: 'AAPL Stock Price',
      data: []
    };
    let volumeserie: Highcharts.SeriesOptionsType = {
      type: 'column',
        id: 'aapl-volume',
        name: 'AAPL Volume',
        data: [],
        yAxis: 1
    }
    for (let i = 0; i < this.data.length; i++) {
      candleserie.data?.push([this.data[i].quotation])
      volumeserie.data?.push(this.data[i].quotation)
    }
    this.series[0] = candleserie;
    this.series[1] = volumeserie;
    if (this.options.series) this.options.series = this.series;
    this.chart = chart('chart-candlestick', this.options);

    this.loaded = true;
  }

}
