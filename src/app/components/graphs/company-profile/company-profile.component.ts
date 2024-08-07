import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfilePopupComponent } from '../components/profile-popup/profile-popup.component';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { EventemittersService } from 'src/app/services/eventemitters.service';
import { CompanyProfileObject, Utility } from 'src/app/models/others';
import { Subscription } from 'rxjs';
import { EllipsisPipe } from 'src/app/common/Pipes/ellipsis.pipe';
import { PivotPipe } from 'src/app/common/Pipes/pivot.pipe';
import { CountryHeads } from 'src/app/models/country';

import * as Highcharts from "highcharts/highmaps";
import * as worldMap from "@highcharts/map-collection/custom/world-highres.geo.json";
import { CompanyFetchBody, PivotType } from 'src/app/models/api.types';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit, OnDestroy {
  // companies = [ 'China National Petroleum Corporation (CNPC)' ,'Sinopec Group' ,'Royal Dutch Shell' ,'ExxonMobil' ,'BP (British Petroleum)' ,'Toyota Motor Corporation' ,'Volkswagen AG' ,'Samsung Electronics' ,'Huawei Technologies' ,'The Boeing Company' ,'General Electric' ,'Daimler AG' ,'Ford Motor Company' ,'General Motors' ,'Siemens AG' ,'Nestle S.A.' ,'Procter & Gamble' ,'Unilever' ,'The Coca-Cola Company' ,'PepsiCo, Inc.' ,'Mitsubishi Corporation' ,'Mitsubishi Electric Corporation' ,'Honda Motor Company' ,'Nissan Motor Corporation' ,'Intel Corporation' ,'Taiwan Semiconductor Manufacturing Company (TSMC)' ,'Glencore International AG' ,'Rio Tinto Group' ,'BHP Group' ,'Vale S.A.' ,'Archer Daniels Midland Company' ,'Cargill, Incorporated' ,'Tyson Foods, Inc.' ,'BASF SE' ,'Dow Chemical Company' ,'Bayer AG' ,'Novartis International AG' ,'Roche Holding AG' ,'Pfizer Inc.' ,'Merck & Co., Inc.' ,'BMW AG' ,'Audi AG' ,'DHL International GmbH' ,'FedEx Corporation' ,'United Parcel Service, Inc. (UPS)' ,'Maersk Group' ,'FedEx Express' ,'Amazon.com, Inc.' ,'Apple Inc.' ,'Microsoft Corporation' ,'Alphabet Inc. (Google)' ,'Facebook, Inc.' ,'IBM Corporation' ,'Boeing Commercial Airplanes' ,'Airbus SE' ,'Honeywell International Inc.' ,'Caterpillar Inc.' ,'Deere & Company' ,'Intel Corporation' ,'Cisco Systems, Inc.' ,'Oracle Corporation' ,'Accenture plc' ,'Deloitte Touche Tohmatsu Limited' ,'PricewaterhouseCoopers (PwC) International Limited' ,'Ernst & Young Global Limited' ,'KPMG International Cooperative' ,'HSBC Holdings plc' ,'JPMorgan Chase & Co.' ,'Citigroup Inc.' ,'Bank of America Corporation'];
  ellipsePipe: EllipsisPipe = new EllipsisPipe();
  pivotPipe: PivotPipe = new PivotPipe();
  comapnyName:string = "";
  mapHighcharts:any;
  // countryData:[string, number][] = [["fo", 1234], ["um", 1], ["us", 2], ["jp", 3434], ["sc", 4], ["in", 12345], ["fr", 6], ["fm", 7], ["cn", 8], ["pt", 9], ["sw", 10], ["sh", 11], ["br", 12], ["ki", 13], ["ph", 14], ["mx", 15], ["es", 16], ["bu", 17], ["mv", 18], ["sp", 19], ["gb", 20], ["gr", 21], ["as", 22], ["dk", 23], ["gl", 24], ["gu", 25], ["mp", 26], ["pr", 27], ["vi", 28], ["ca", 29], ["st", 30], ["cv", 31], ["dm", 32], ["nl", 33], ["jm", 34], ["ws", 35], ["om", 36], ["vc", 37], ["tr", 38], ["bd", 39], ["lc", 40], ["nr", 41], ["no", 42], ["kn", 43], ["bh", 44], ["to", 45], ["fi", 46], ["id", 47], ["mu", 48], ["se", 49], ["tt", 50], ["my", 51], ["pa", 52], ["pw", 53], ["tv", 54], ["mh", 55], ["cl", 56], ["th", 57], ["gd", 58], ["ee", 59], ["ag", 60], ["tw", 61], ["bb", 62], ["it", 63], ["mt", 64], ["vu", 65], ["sg", 66], ["cy", 67], ["lk", 68], ["km", 69], ["fj", 70], ["ru", 71], ["va", 72], ["sm", 73], ["kz", 74], ["az", 75], ["tj", 76], ["ls", 77], ["uz", 78], ["ma", 79], ["co", 80], ["tl", 81], ["tz", 82], ["ar", 83], ["sa", 84], ["pk", 85], ["ye", 86], ["ae", 87], ["ke", 88], ["pe", 89], ["do", 90], ["ht", 91], ["pg", 92], ["ao", 93], ["kh", 94], ["vn", 95], ["mz", 96], ["cr", 97], ["bj", 98], ["ng", 99], ["ir", 100], ["sv", 101], ["sl", 102], ["gw", 103], ["hr", 104], ["bz", 105], ["za", 106], ["cf", 107], ["sd", 108], ["cd", 109], ["kw", 110], ["de", 111], ["be", 112], ["ie", 113], ["kp", 114], ["kr", 115], ["gy", 116], ["hn", 117], ["mm", 118], ["ga", 119], ["gq", 120], ["ni", 121], ["lv", 122], ["ug", 123], ["mw", 124], ["am", 125], ["sx", 126], ["tm", 127], ["zm", 128], ["nc", 129], ["mr", 130], ["dz", 131], ["lt", 132], ["et", 133], ["er", 134], ["gh", 135], ["si", 136], ["gt", 137], ["ba", 138], ["jo", 139], ["sy", 140], ["mc", 141], ["al", 142], ["uy", 143], ["cnm", 144], ["mn", 145], ["rw", 146], ["so", 147], ["bo", 148], ["cm", 149], ["cg", 150], ["eh", 151], ["rs", 152], ["me", 153], ["tg", 154], ["la", 155], ["af", 156], ["ua", 157], ["sk", 158], ["jk", 159], ["bg", 160], ["qa", 161], ["li", 162], ["at", 163], ["sz", 164], ["hu", 165], ["ro", 166], ["ne", 167], ["lu", 168], ["ad", 169], ["ci", 170], ["lr", 171], ["bn", 172], ["iq", 173], ["ge", 174], ["gm", 175], ["ch", 176], ["td", 177], ["kv", 178], ["lb", 179], ["dj", 180], ["bi", 181], ["sr", 182], ["il", 183], ["ml", 184], ["sn", 185], ["gn", 186], ["zw", 187], ["pl", 188], ["mk", 189], ["py", 190], ["by", 191], ["cz", 192], ["bf", 193], ["na", 194], ["ly", 195], ["tn", 196], ["bt", 197], ["md", 198], ["ss", 199], ["bw", 200], ["bs", 201], ["nz", 202], ["cu", 203], ["ec", 204], ["au", 205], ["ve", 206], ["sb", 207], ["mg", 208], ["is", 209], ["eg", 210], ["kg", 211], ["np", 212]];
  countryData:[string, number][] = [];
  isCompanySelected:boolean = false;
  isTableShow:boolean = false;
  tableColNames:CountryHeads = new CountryHeads();
  
  searchInp:string = "";
  isCompanyFromSameCountry:boolean = false;
  isContactClicked:boolean = false;
  countryObj:any = {};
  counterEvenObj:any = {};
  currentTab:string = "export";
  currentKey:string = "";
  isLoading:boolean = false;
  subHeads2:string[] = ["suppliers", "hs codes", "countries", "quantity", "shipments", "employees", "establishedyear"];//"buyers", "suppliers"
  currencyConvertor:Function = this.alertService.valueInBillion;

  companyInfoPoints:any[] = [
    {icon: "phone", data: "N/A"},
    {icon: "envelope", data: "N/A"},
    {icon: "location-dot", data: "N/A"},
    {icon: "building", data: "N/A"},
    {icon: "circle-info", data: "N/A"}
  ];

  tempLinkedInList:any[] = [
    {id: 1, name: "manoj", link: "https://fontawesome.com/search?q=insta&o=r"},
    {id: 2, name: "raj", link: "https://fontawesome.com/search?q=insta&o=r"},
    {id: 3, name: "sobna", link: "https://fontawesome.com/search?q=insta&o=r"},
    {id: 4, name: "bhanu", link: "https://fontawesome.com/search?q=insta&o=r"},
    {id: 5, name: "kunal", link: "https://fontawesome.com/search?q=insta&o=r"},
    {id: 6, name: "akash", link: "https://fontawesome.com/search?q=insta&o=r"},
    {id: 7, name: "pooja", link: "https://fontawesome.com/search?q=insta&o=r"},
    {id: 8, name: "vandana", link: "https://fontawesome.com/search?q=insta&o=r"},
    {id: 9, name: "preeti", link: "https://fontawesome.com/search?q=insta&o=r"},
    {id: 10, name: "neha", link: "https://fontawesome.com/search?q=insta&o=r"},
    {id: 12, name: "nisha", link: "https://fontawesome.com/search?q=insta&o=r"},
    {id: 13, name: "simran", link: "https://fontawesome.com/search?q=insta&o=r"},
    {id: 14, name: "manav", link: "https://fontawesome.com/search?q=insta&o=r"},
    {id: 15, name: "bharti", link: "https://fontawesome.com/search?q=insta&o=r"},
  ];

  tableName:string = "";
  isAllShipmentShow:boolean = false;
  isPivotExpand:boolean = false;
  isPivotSorted:boolean = false;
  pivotTable:any = {};
  pivotTableKeys:string[] = [];
  pivotLoading:boolean = false;
  companyAllShipments:any[] = [];
  currentTableData:any[] = [];
  shipmentTableName:string = "";
  currentTableHeads:string[] = [];
  

  profileApiObj:any = {};

  apiSubscription1:Subscription;
  eventSubscription1:Subscription;

  companyData:CompanyProfileObject = new CompanyProfileObject();

  constructor(
    private modalService: NgbModal,
    private eventService: EventemittersService,
    private apiServcie: ApiServiceService,
    private alertService: AlertifyService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.reloadWorldMap();
    this.getCurrentCountryData();
    this.searchCompanyDetails();
  }

  ngOnDestroy(): void {
    this.eventSubscription1.unsubscribe();
    this.apiSubscription1.unsubscribe();
  }

  getEllipsedLink(link:string):string {
    return this.ellipsePipe.transform(link, 40);
  }

  resetProfile() {
    this.companyAllShipments = [];
    this.companyData = new CompanyProfileObject();
    this.companyInfoPoints.forEach(item => item["data"] = "N/A");
  }

  switchTab(e:any) {
    const isChecked = e.target.checked;
    this.resetProfile();
    this.isLoading = true;
    this.currentTab = !isChecked ? "export": "import";
    this.subHeads2.shift();
    this.subHeads2 = [this.currentTab=="import"?"suppliers":"buyers", ...this.subHeads2];
    this.getRequiredCounts();
  }

  showCompanyDetail(name:string) {
    this.comapnyName = name;
    this.isCompanySelected = true;
  }

  showDetailTable(item:string) {
    if(!["contact", "shipments", "value", "quantity", "location", "established year", "employees"].includes(item)) {
      const modalRef = this.modalService.open(ProfilePopupComponent, { windowClass: 'profileDetailModal' });
      (<ProfilePopupComponent>modalRef.componentInstance).setDataToGrid();
    } else if(item == "contact") this.isContactClicked = true;
  }

  getRequiredCounts() {
    const {country, companyDirection} = this.countryObj;    
    // const companyColName = this.counterEvenObj?.tabDirectionType=="supplier" ? "Exp_Name": "Imp_Name";
    
    const apiObj:CompanyFetchBody = {
      countryname: country==""?"India":country,
      companyname: this.searchInp.toUpperCase(),
      direction: this.currentTab,
      sameCompanyCountry: this.isCompanyFromSameCountry
    };

    this.getSelectedCompanyData(apiObj); 
  }

  getSelectedCompanyData(body:any) {
    this.apiSubscription1 = this.apiServcie.getCompanyProfileCounts(body).subscribe({
      next: (res:any) => {
        if(!res?.error) {           
          this.companyAllShipments = res?.results;
          this.setValuesOfCompany(res?.results);
        }
      }, error: (err:any) => { this.isLoading = false; }
    });
  }

  setValuesOfCompany(arrData:any[]) {
    if(arrData.length==0) {
      this.isLoading = false;
      return;
    }

    const keys = ["HsCode", "Quantity", "ValueInUSD", "Exp_Name", "Imp_Name", "countries"];
    const countryKey = this.currentTab=="import" ? "CountryofOrigin": "CountryofDestination";
    //,this.profileApiObj["direction"]=="import"?"CountryofOrigin":"CountryofDestination"];
    this.companyData.shipments = arrData.length;

    let tempArr = [];    
    this.companyInfoPoints[0]["data"] = arrData[0]["Importer_Phone"] || arrData[0]["Exp_Phone"] || "N/A";
    this.companyInfoPoints[1]["data"] = arrData[0]["Importer_Email"] || arrData[0]["Exp_Email"] || "N/A";
    this.companyInfoPoints[2]["data"] = arrData[0]["Importer_City"] || arrData[0]["Exp_City"] || "N/A";
    this.companyInfoPoints[3]["data"] = arrData[0]["Importer_Address"] && `${arrData[0]["Importer_Address"]}, ${arrData[0]["Importer_PIN"]}` || arrData[0]["Exp_City"] && `${arrData[0]["Exp_City"]}, ${arrData[0]["Exp_PIN"]}` || "N/A";

    for(let i=0; i<keys.length; i++) {
      if(keys[i]=="countries") { keys[i] = countryKey; }

      arrData.map(item => tempArr.push(item[keys[i]]));
      const copyArr = [...tempArr];
      tempArr = [];

      if(!["Quantity", "ValueInUSD"].includes(keys[i])) {
        const finalArr = Array.from(new Set(copyArr));
        this.companyData[keys[i]]["dataList"] = JSON.parse(JSON.stringify(arrData));
        this.companyData[keys[i]]["count"] = finalArr.length;
      } else {
        const sum = copyArr.reduce((acc, curr) => acc + curr, 0);
        this.companyData[keys[i]] = Number((sum/1000000).toFixed(2))+" M";
      }
    }
    this.isLoading = false;
    setTimeout(() => {
      this.prepareMapData(this.companyData[countryKey]["dataList"]).then((res:any[]) => {
        console.log(res);
        this.countryData = res;
        this.worldMapInit();
      }).catch((err:any) => console.log(err));
    }, 500);
  }

  getProfileValue(key:string) {
    const keyObj = {buyers: "Imp_Name", suppliers: "Exp_Name", hscodes: "HsCode", quantity: "Quantity", value: "ValueInUSD"};
    // const direction = this.countryObj.companyDirection==undefined ? this.countryObj.direction : this.countryObj.companyDirection; 
    keyObj["countries"] = this.currentTab=="import" ? "CountryofOrigin": "CountryofDestination";
    key = key.replace(new RegExp(" ", "g"), "").toLowerCase();

    if(Object.keys(keyObj).includes(key)) {
      if(["quantity", "value"].includes(key)) return this.companyData[keyObj[key]];
      else return this.companyData[keyObj[key]]["count"];
    } else return this.companyData[key];
  }

  getCurrentCountryData() {
    this.eventService.currentCountry.subscribe({
      next: (res:any) => {
        if(Object.keys(res).length>0) this.countryObj = res;
      }, error: (err:any) => console.log(err)
    });
  }

  searchCompanyDetails() {
    this.eventSubscription1 = this.eventService.companyProfileEvent.subscribe({
      next: (res:any) => {
        if(Object.keys(res).length>0 && res.target == "companyProfile") {
          this.counterEvenObj = {...res};
          this.currentTab = res?.direction;
          this.searchInp = res?.companyName;
          this.isCompanyFromSameCountry = (this.currentTab=="import" && res.tabDirectionType=="buyer" || this.currentTab=="export" && res.tabDirectionType=="supplier") ? true: false;
          
          res.tabDirectionType=="supplier" ? "Exp_Name": "Imp_Name";
          this.profileApiObj = {
            countryname: res?.country,
            companyname: this.searchInp.toUpperCase(),
            direction: this.currentTab,
            sameCompanyCountry: this.isCompanyFromSameCountry
          };
          // this.resetProfile();
          this.showCompanyDetail(res?.companyName);
          this.getSelectedCompanyData(this.profileApiObj);
        }
      }, error: (err:any) => console.log(err)
    });
  }

  public getColName(key:string):string {
    const country:string = this.profileApiObj.countryname;
    const countryName = country[0].toUpperCase() + country.slice(1, country.length);
    return this.tableColNames[countryName][this.currentTab][key];
  }

  showShipmentTable(keyType:string) {
    if(!["buyers", "suppliers", "hs codes", "countries", "shipments"].includes(keyType)) return;
    this.isTableShow = true;
    this.pivotLoading = true;
    
    setTimeout(async() => {
      if(keyType!="shipments") {
        this.currentKey = keyType;
        let keyInOrderArr:string[] = [];
    
        if(["buyers", "suppliers"].includes(keyType)) {
          keyInOrderArr = ["company", "country", "HsCode"];
          this.shipmentTableName = `${keyType.toUpperCase()} WISE PIVOT`;
        } else if(keyType == "hs codes") {
          keyInOrderArr = ["HsCode", "company", "country"];
          this.shipmentTableName = `HSN CODES WISE PIVOT`;
        } else if(keyType == "country") {
          keyInOrderArr = ["country", "HsCode", "company"];
          this.shipmentTableName = `COUNTRY WISE PIVOT`;
        } else {
          keyInOrderArr = ["country", "HsCode", "company"];
          this.shipmentTableName = `ALL SHIPMENTS`;
        }
    
        const keys:PivotType = { keysArr: keyInOrderArr, direction: this.currentTab };
    
        this.pivotTable = await this.pivotPipe.transform(this.companyAllShipments, keys);    
        this.pivotTableKeys = Object.keys(this.pivotTable);
        this.pivotTableKeys.splice(this.pivotTableKeys.indexOf("value"), 1);
        this.pivotLoading = false;
      } else {
        this.shipmentTableName = "All SHIPMENT RECORDS";
        this.currentTableHeads = ["HsCode", "Quantity", "ValueInUSD"];
        this.currentTableHeads.unshift(this.currentTab=="import" ? "CountryofOrigin": "CountryofDestination");
        this.currentTableHeads.unshift(this.currentTab=="import" ? "Exp_Name": "Imp_Name");
        this.currentTableData = await JSON.parse(JSON.stringify(this.companyAllShipments));
        this.isAllShipmentShow = true;
        this.pivotLoading = false;
      }
    }, 1000);
  }

  toggleDetailOpen():void {
    this.isPivotExpand = !this.isPivotExpand;
    const levelOneDetailTags:NodeListOf<HTMLDetailsElement> = document.querySelectorAll(".level1") as NodeListOf<HTMLDetailsElement>;
    const levelTwoDetailTags:NodeListOf<HTMLDetailsElement> = document.querySelectorAll(".level2") as NodeListOf<HTMLDetailsElement>;

    levelOneDetailTags.forEach((item:HTMLDetailsElement) => { item.open = this.isPivotExpand; });
    levelTwoDetailTags.forEach((item:HTMLDetailsElement) => { item.open = this.isPivotExpand; });
  }

  closePivotTable() {
    this.isTableShow = false;
    this.isPivotExpand = false;
    this.isPivotSorted = false;
    this.isAllShipmentShow = false;
    this.currentTableHeads = [];
  }

  sortDataList() {
    this.isPivotSorted = !this.isPivotSorted;
    const tempPivotTableKeys = Object.keys(JSON.parse(JSON.stringify(this.pivotTable)));
    tempPivotTableKeys.splice(tempPivotTableKeys.indexOf("value"), 1);
    const tempPivotTableKeysLen = tempPivotTableKeys.length;
    
    for(let i=0; i<tempPivotTableKeysLen; i++) {
      this.pivotTableKeys = tempPivotTableKeys.sort((second:string, first:string) => {
        if(this.isPivotSorted) return this.pivotTable[second]["value"] - this.pivotTable[first]["value"];
        else return this.pivotTable[first]["value"] - this.pivotTable[second]["value"];
      });
    }
  }



  
  // showShipments(keyType:string) {
  //   const tableKeysobj = {
  //     buyers: "Imp_Name",
  //     suppliers: "Exp_Name",
  //     "hs codes": "HsCode",
  //     countries: {import: "CountryofOrigin", export: "CountryofDestination"},
  //     shipments: "shipments"
  //   };
    
  //   if(tableKeysobj.hasOwnProperty(keyType)) {
  //     let columnName = "";
  //     if(this.currentTableHeads.length>3) {
  //       const restCols = ["Exp_Name", "Imp_Name", "CountryofOrigin", "CountryofDestination"];
  //       restCols.forEach((col:string) => {
  //         if(this.currentTableHeads.includes(col)) {
  //           const colIndex = this.currentTableHeads.indexOf(col);
  //           this.currentTableHeads.splice(colIndex, 1);
  //         }
  //       });
  //     }

  //     if(keyType=="countries") {
  //       columnName = tableKeysobj[keyType][this.currentTab];        
  //     } else { columnName = tableKeysobj[keyType]; }

  //     if(keyType!="shipments") {
  //       this.shipmentTableName = {labelName: keyType.toUpperCase(), keyName: columnName};
  //       this.currentTableData = JSON.parse(JSON.stringify(this.companyData[columnName]["dataList"]));
  //     } else {
  //       this.shipmentTableName = {labelName: "OVERALL SHIPMENTS", keyName: "shipments"};
  //       this.currentTableData = JSON.parse(JSON.stringify(this.companyAllShipments));
  //     }
  //     this.currentTableHeads.push(this.currentTab=="import" ? "CountryofOrigin": "CountryofDestination");
  //     this.currentTableHeads.push(this.currentTab=="import" ? "Exp_Name": "Imp_Name");

  //     if(this.shipmentTableName.keyName!="shipments") {
  //       this.currentTableHeads.splice(this.currentTableHeads.indexOf(this.shipmentTableName.keyName), 1);
  //       this.currentTableHeads.unshift(this.shipmentTableName.keyName);
  //     } else {this.currentTableHeads.push(this.currentTab=="import" ? "Imp_Name": "Exp_Name");}

  //     this.isTableShow = true;
  //   }

  //   // const keys:PivotType = {
  //   //   keysArr: ["country", "HsCode", "company"],
  //   //   direction: this.currentTab
  //   // };
  //   // this.pivotTable = await this.pivotPipe.transform(res?.results, keys);
  // }

  worldMapInit() {
    const labelName = this.currentTab=="import" ? "Importer" : "Exporter";

    this.mapHighcharts = Highcharts.mapChart('map-container', {
      chart: {
        map: worldMap,
        animation: true,
        events: {
          load: function () {
            const chart = this;

            // Function to set chart size based on container size
            function resizeChart() {
                chart.setSize(null, null);
            }

            // Attach the resize function to window resize event
            window.addEventListener('resize', resizeChart);
          }
        }
      },
      credits: {enabled: false},
      title: {
        text: `${labelName} Countries Total Values`,
        align: "center",
        verticalAlign: "top",
        style: {
          color: 'black',
          fontSize: '20px',
          fontWeight: 'bold',
          fontFamily: 'Roboto, sans-serif',
          textTransform: 'uppercase'
        }
      },
      colors: ['#e5e5e5'],
      mapNavigation: {
        enabled: true,
        buttonOptions: { alignTo: "spacingBox" }
      },
      plotOptions: {map: {borderColor: "white", borderWidth: 1.3}, series: {dataLabels: {enabled: true}}},
      legend: {enabled: false},
      colorAxis: {dataClasses: []},
      tooltip: {
        enabled: true,
        useHTML: true,
        borderColor: '#aaa',
        backgroundColor: "white",
        headerFormat: '<div style="width:100%;margin-bottom:10px;text-align:center;color:black;"><b>{point.point.name}</b></div>',
        pointFormat: `<b>${labelName} Value:</b>&nbsp;{point.value}K $`,//<br><b>Other: </b>{point.total}
      },
      series: [
        {
          type: "map",
          showInLegend: false,
          states: {
            hover: {color: "#82d2c0",borderColor: "#606060"}
          },
          dataLabels: {
            enabled: true,
            formatter: function() { return this.point.value ? this.point.name : null; }
          },
          allAreas: true,          
          data: this.countryData,
          color: "#4cbfa6",
          nullColor: "#007bff96"
        }]
    });
  }


  prepareMapData(dataArr:any[]) {
    const numInK = (val:number):string => Number(val/1000).toFixed(2);

    return new Promise((resolve, reject) => {
      const arrLen = dataArr.length;
      const countryKey = this.currentTab=="import" ? "CountryofOrigin": "CountryofDestination";
      const tempObj = {};
      
      for(let i=0; i<arrLen; i++) {
        const countryName = (<string>dataArr[i][countryKey]).toLowerCase();
        if(tempObj.hasOwnProperty(countryName)) { tempObj[countryName] += Number(dataArr[i]["ValueInUSD"]); }
        else { tempObj[countryName] = Number(dataArr[i]["ValueInUSD"]); }
      }
  
      const tempObjkeys = Object.keys(tempObj);
      const tempObjLen = tempObjkeys.length;
      const allCountryCode = new Utility().countries;
      const worldMapData = [];
  
      for(let j=0; j<tempObjLen; j++) {
        const codeItem = allCountryCode.filter(item => item["name"].toLowerCase() == tempObjkeys[j]);
        if(codeItem.length>0) {
          const countryValue = numInK(tempObj[codeItem[0]["name"].toLowerCase()]);
          worldMapData.push([codeItem[0]["code"].toLowerCase(), Number(countryValue)]);
        }
      }

      resolve(worldMapData);
    });
  }

  reloadWorldMap() {
    this.eventService.sidebarToggleEvent.subscribe({
      next: (res:any) => {
        this.mapHighcharts.destroy();
        setTimeout(() => this.worldMapInit(),250);
      },
      error: (err:any) => console.log(err)
    });
  }

  toTwoStr(value:number) {
    return value.toFixed(2);
  }
}

//https://www.google.com/search?q=xvy+pvt+ltd&ie=UTF-8


