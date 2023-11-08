import getData from '@/app/utils/chartdata';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

export default function AssetChart() {
    const data = getData();

    const options: ApexOptions = {
        chart: {
          type: 'candlestick',
          height: 350
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          tooltip: {
            enabled: true
          }
        }
    }

    const optionsBar: ApexOptions = {
      chart: {
        height: 160,
        type: 'bar',
        brush: {
          enabled: true,
          target: 'candles'
        },
        selection: {
          enabled: true,
          xaxis: {
            min: new Date('20 Jan 2017').getTime(),
            max: new Date('10 Dec 2017').getTime()
          },
          fill: {
            color: '#ccc',
            opacity: 0.4
          },
          stroke: {
            color: '#0D47A1',
          }
        },
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        bar: {
          columnWidth: '80%',
          colors: {
            ranges: [{
              from: -1000,
              to: 0,
              color: '#F15B46'
            }, {
              from: 1,
              to: 10000,
              color: '#FEB019'
            }],
      
          },
        }
      },
      stroke: {
        width: 0
      },
      xaxis: {
        type: 'datetime',
        axisBorder: {
          offsetX: 13
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      }
    }

    return (
          <div id="chart">
            <ReactApexChart options={options} series={data.series} type="candlestick" height={350} />
          </div>
    )
}