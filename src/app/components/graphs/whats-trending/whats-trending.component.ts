import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Utility } from 'src/app/models/others';
import { CountriesData, ChartSelectEvent } from 'countries-map';
import { EventemittersService } from 'src/app/services/eventemitters.service';
import { Subscription } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
// import {EChartsOption} from 'echarts';
// import * as echarts from 'echarts';
// import worldMap from 'src/assets/worldMap.json';


@Component({
  selector: 'app-whats-trending',
  templateUrl: './whats-trending.component.html',
  styleUrls: ['./whats-trending.component.css']
})
export class WhatsTrendingComponent implements OnInit, OnDestroy {
  @Input() currentPage:string = "";

  exportValue:string = "";
  importValue:string = "";
  totalValue:string = "";

  containerHeight:any = [];

  isAnalysisTabActive:boolean = false;
  eventSubscription:Subscription;  
  eventSubscription2:Subscription;  
  allCountries:Utility = new Utility();
  mapData: CountriesData = {
    'ES': { 'value': 416, 'extra': {'country': 'Span'}},
    'GB': { 'value': 426, 'extra': {'country': 'Australia'}},
    'FR': { 'value': 406, 'extra': {'country': 'France'}},
    'IN': { 'value': 555, 'extra': {'country': 'India'}},
  };
  tableHeads:string[] = ['country','export','import','export(%)','import(%)'];
  smChartOptions = [
    {
      id: 1,
      data: [15, 5, 20, 10, 30, 13, 5, 28],
      borderColor: '#48b1f0',
      backColor: '#cbeefc'
    },
    {
      id: 2,
      data: [15, 5, 20, 10, 30, 13, 5, 28],
      borderColor: '#f8bf45',
      backColor: '#fef3d6'
    },
    {
      id: 3,
      data: [15, 5, 20, 10, 30, 13, 5, 28],
      borderColor: '#56b353',
      backColor: '#cceeda'
    }
  ];
  mdChartOptions = [
    {
      id: 1,
      legend: false,
      labels: [],
      data: [],
      borderColor: 'rgb(255, 99, 132)',
      backColor: 'rgba(255, 99, 132, 0.2)'
    },
    {
      id: 2,
      legend: true,
      labels: [],
      data: [],
      borderColor: ["#50af48", "#40acf0", "#f8bf45", "#f44336d1","#e81e63d1","#9c27b0d1","#673ab7d1","#3f51b5d1","#2196f3d1","#03a9f4d1"],
      backColor: ["#50af48", "#40acf0", "#f8bf45", "#f44336d1","#e81e63d1","#9c27b0d1","#673ab7d1","#3f51b5d1","#2196f3d1","#03a9f4d1"]
    },
    {
      id: 3,
      legend: true,
      labels: [],
      data: [
        { label: '', backgroundColor: "#50af48", data: [] }, 
        { label: '', backgroundColor: "#40acf0", data: [] }, 
        { label: '', backgroundColor: "#f8bf45", data: [] }
      ]
    },
    {
      id: 4,
      legend: false,
      labels: [],
      data: [],
      borderColor: '#f9c750'
    }
  ];
  currentRating:number = 1.5;
  ratingArr = [];

  constructor(
    private alertServcie: AlertifyService,
    private apiService: ApiServiceService,
    private eventService: EventemittersService
  ) { }

  ngOnInit(): void {    
    if(`${this.currentRating}`.includes('.')) {
      for(let i=1; i<=5; i++) {
        if(i < this.currentRating) this.ratingArr.push('full');
        else if(i > this.currentRating && i-1 < this.currentRating) this.ratingArr.push('half');
        else this.ratingArr.push('no');
      }
    } else {
      for(let i=0; i<5; i++) {
        if(i+1 <= this.currentRating) this.ratingArr.push('full');
        else this.ratingArr.push('no');
      }
    }

    //on changing of tab from table to analysis or vice-versa
    this.eventSubscription = this.eventService.dataTabChngEvent.subscribe(res => {
      this.isAnalysisTabActive = res;
    });

    //get container height as per resolution
    this.getCurrentHeight();

    this.whatsTrendingDataInit();
    this.getTotalShipmentValue(2022);
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
    this.eventSubscription2.unsubscribe();
  }

  getCurrentHeight() {
    this.containerHeight = this.alertServcie.setAsPerRes("whatstrending");
  }

  whatsTrendingDataInit() {
    this.eventSubscription2 = this.eventService.whatsTrendingEvent.subscribe({
      next: (year:number) => {
        this.getTotalShipmentValue(year);
      }, error: (err:any) => {console.log(err);}
    });
  }

  getTotalShipmentValue(year:number) {
    this.apiService.getWhatstrandingTotalVal(year).subscribe({
      next: (res:any) => {
        if(!res.error) {
          const {total_import, total_export, total_value} = res?.results[0];
          const totalCount = Number(total_value);
          this.exportValue = ((Number(total_export) * 100) / totalCount).toFixed(2) + "%";
          this.importValue = ((Number(total_import) * 100) / totalCount).toFixed(2) + "%";
          this.totalValue = Number(totalCount / 1000000000).toFixed(2) + " Bn $";
        }
      }, error: (err:any) => {console.log(err);}
    });
  }
}
