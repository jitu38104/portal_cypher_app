import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-table-card-chart',
  templateUrl: './table-card-chart.component.html',
  styleUrls: ['./table-card-chart.component.css']
})
export class TableCardChartComponent implements OnInit, AfterViewInit, OnDestroy{
  lineChart:Chart;
  @Input() chartId:string='';
  @Input() chartOption:any;
  chartLabels:string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August']; 
  intervalVar:any;

  constructor() { }
  ngOnDestroy(): void {
    clearInterval(this.intervalVar);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.setGraphDetails(this.chartId);
  }


  setGraphDetails(id) {
    const lineCanvasEle: any = document.getElementById('chart_line_'+id);
    this.lineChart = new Chart(lineCanvasEle.getContext('2d'), {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [
          { 
            data: this.chartOption.data,//[15, 5, 20, 10, 30, 13, 5, 28], 
            borderColor: this.chartOption.borderColor,//'#48b1f0',
            pointBackgroundColor: this.chartOption.borderColor,//'#48b1f0',
            backgroundColor: this.chartOption.backColor,//'#cbeefc',
            fill: true,
          }
        ],
      },
      options: {
        animation: false,
        plugins: {legend: {display: false}},
        responsive: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {display: false},
                border: {display: false},
                ticks: {display: false}
            },
            x: {
              beginAtZero: true,
              grid: {display: false},
              border: {display: false},
              ticks: {display: false},
            },
          },
        maintainAspectRatio: false
      }
    });
  
    this.intervalVar = setInterval(() => this.chartUpdate2(), 2000);
  }

  chartUpdate2() {
    this.lineChart.data.labels.push(this.lineChart.data.labels.shift());
    this.lineChart.data.datasets[0].data.push(this.lineChart.data.datasets[0].data.shift());
    this.lineChart.update();
  }
}
