import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { EventemittersService } from 'src/app/services/eventemitters.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})
export class CountryListComponent implements OnInit {

  constructor(
    private userService:UserService,
    public activeModal: NgbActiveModal, 
    private authService: AuthService,
    private eventService: EventemittersService
  ) { }
  
  apiRunCounter:number = 0;
  countryList: any[] = [];
  userDetails:any;
  lastTabTagId:string = "globeTab1";
  copiedCountryList:any[] = [];
  availableCoutriesTypes = {
    "globeTab1": [],
    "globeTab2": [],
    "globeTab3": [],
    "globeTab4": []
  }
  hasDataReceived:boolean = false;
  countryHeads:string[] = ['countries', 'availability', 'direction', 'data coverage', 'data fields', 'sample'];
  modalHeadWidth = {
    'countries': '20%', 
    'direction': '8%',
    'data coverage': '10%', 
    'data availability': '15%', 
    'sample': '7%'
  };

  tabs:any[] = [
    {tabName: "100% Coverage", key: "globeTab1"},
    {tabName: "(60-70)% Coverage", key: "globeTab2"},
    {tabName: "(30-40)% Coverage", key: "globeTab3"},
    {tabName: "Statics", key: "globeTab4"}
  ]

  ngOnInit(): void {
    this.userDetails = this.authService.getUserDetails();
  }

  isAvailbale(country:string):boolean {
    if(this.userDetails["CountryAccess"] == "All") {
      return true;
    } else {
      const countriesArr:string[] = (this.userDetails["CountryAccess"]).split(",");
      if(countriesArr.includes(country)) return true;
      else return false;
    }
  }

  onClickTab(id:string) {
    if(id == this.lastTabTagId) return;
    
    if(this.lastTabTagId == "") {this.lastTabTagId = id;} 
    else {this.lastTabTagId = id;}
  }

  //hitting api to get all country
  getCountryList(result:any[]){
    if(result.length == 0) this.getCountryListApi();

    result = result.filter(item => item?.Export && item?.Direction=='export' || item?.Import && item?.Direction=='import')
    this.availableCoutriesTypes["globeTab1"] = JSON.parse(JSON.stringify(result));
    this.copiedCountryList = JSON.parse(JSON.stringify(this.availableCoutriesTypes["globeTab1"]));

    // this.countryList = [...result];

    // this.copiedCountryList = [...this.countryList];    

    this.hasDataReceived = true;
  }

  //to set the current country and send to the homepage this value
  onSelectCountry(item, direction) {
    const objData = {country: item?.CountryName, direction, code: item?.Countrycode};
    this.eventService.currentCountry.next(objData);
    this.eventService.refreshPageNameEvent.next("country");
    this.eventService.headerClickEvent.emit('home');
    this.activeModal.dismiss('Cross click');
  }

  onSearch(e:any) {//{Coutrycode: 'IND', CountryName: 'India'}
    const currentVal = (e.target.value).toLowerCase();
    // const tempArr = this.countryList.filter(obj => ((obj?.CountryName).toLowerCase()).includes(currentVal));
    const tempArr = this.availableCoutriesTypes[this.lastTabTagId].filter((obj:any) => ((obj?.CountryName).toLowerCase()).includes(currentVal));
    this.copiedCountryList = JSON.parse(JSON.stringify(tempArr));
  }

  onHover(e:any, bool:boolean) {
    if(bool) {
      e.target.classList.remove('gray-bgColor');
      e.target.classList.add('blue-bgColor');
    } else {
      e.target.classList.remove('blue-bgColor');
      e.target.classList.add('gray-bgColor');
    }
  }

  getProperName(name:string) {
    if(name.toLowerCase() == 'philip') return 'philippines';
    return name;
  }

  isIndiaCountry(item:any):boolean {
    return (item?.CountryName==this.userDetails?.CountryCode && this.userDetails?.CountryCode=='India');
  }

  getCountryListApi() {
    if(this.apiRunCounter>0) return;

    this.apiRunCounter++;

    this.userService.getCountrylist().subscribe({
      next: (res:any) => {
        if(!res?.error) this.getCountryList(res?.results);
      }
    });
  }
}
