import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-commodity-table',
  templateUrl: './commodity-table.component.html',
  styleUrls: ['./commodity-table.component.css']
})
export class CommodityTableComponent implements OnInit {

  tableHeads:string[] = ['','commodity', 'chart', 'last year', '6 months', '1 month', 'day', 'total value', 'percentage'];
  tableDataset = {
    id: 1,
    data: [15, 5, 20, 10, 30, 13, 5, 28],
    borderColor: '#48b1f0',
    backColor: '#cbeefc'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
