import { Component, OnInit, AfterViewInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, forkJoin } from 'rxjs';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { EventemittersService } from 'src/app/services/eventemitters.service';

@Component({
  selector: 'app-locator-modal',
  templateUrl: './locator-modal.component.html',
  styleUrls: ['./locator-modal.component.css']
})
export class LocatorModalComponent implements OnInit, AfterViewInit, OnDestroy {
  searchVal:string = '';
  locatorType:string = '';
  isMainSelect:boolean = false;
  isSelectAllShow:boolean = false;
  locatorObj = { country: "", type: "", fromDate: "", toDate: "" };
  listArr:any[] = [];
  copyArr:any[] = [];
  backupLocatorData:any = {};
  isLocatorExist = ():boolean => Object.keys(this.backupLocatorData).length>0;
  isError:boolean = false;
  selectedArr:string[] = [];
  errorMsg:string = 'No Data Found';
  hasExceeded:boolean = false;

  perPageLocators:any[] = [];
  currentPageNum:number = 0;
  columnDirection:string = "";

  alphabets:string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "All"];
  @Output() callBack:EventEmitter<string[]> = new EventEmitter();

  eventSubscription:Subscription;
  apiSubscription:Subscription;
  apiSubscription2:Subscription;

  constructor(
    public activeModal: NgbActiveModal, 
    private eventService: EventemittersService,
    private apiService: ApiServiceService
  ) { }

  ngOnInit(): void {
    this.eventSubscription = this.eventService.locatorDataMove.subscribe((res) => {
      if(Object.keys(res).length>0) {
        if(res.hasOwnProperty("error")) setTimeout(() => this.isError = true, 1000);
        else {
          this.backupLocatorData = {...res};
          this.setLocatorsArr({...res});
        }
      }
    });
  }

  setLocatorsArr(res, isFiltered=false) {
    const colDirType = this.locatorType=="importer" ? "Imp_Name" : "Exp_Name";
    const locatorsArr = [...res[colDirType]];

    try {
      if(locatorsArr.length>0) {
        this.columnDirection = Object.keys(locatorsArr[0])[1];
    
        if(!isFiltered) this.listArr = [...locatorsArr];
        this.copyArr = [...locatorsArr];
        this.perPageLocators = locatorsArr.splice(0, 100);      
      } else this.isError = true;
    } catch (error) {
      this.isError = true; //due to empty array in this condition      
    }    
  }

  ngAfterViewInit() {  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
    if(this.apiSubscription) this.apiSubscription.unsubscribe();
    if(this.apiSubscription2) this.apiSubscription2.unsubscribe();
  }

  getData() {
    if(this.listArr.length == 0) this.isError = true;
    else this.isError = false; 
  }

  searchingMoreLocator() {
    const { country, type, fromDate, toDate } = this.locatorObj;
    
    if(this.searchVal.length > 3) {
      this.isSelectAllShow = false;

      let directionType = "";
        if(type == "export") directionType = this.locatorType=="exporter" ? "import" :  "export";
        else directionType = this.locatorType=="exporter" ? "export" :  "import";
        
        const dataObj = {country, direction: directionType, date: {from: fromDate, to: toDate}}

        this.apiService.getGlobeImpExpLocator(dataObj, this.searchVal.toUpperCase()).subscribe({
          next: (res:any) => {
            if(!res?.error) {
              const modifiedArr = [], searchedObj = {};
              
              if(res?.results.length > 0) {
                for(let i=0; i<res?.results.length; i++) { 
                  const colDir = this.locatorType=="exporter" ? "Exp_Name" : "Imp_Name";
                  const actualDirCol = Object.keys(res?.results[i])[1];
                  const newObj = {id: res?.results[i]["id"]};
                  newObj[this.columnDirection] = res?.results[i][actualDirCol];
                  modifiedArr.push(newObj);
      
                  if(i == res?.results.length-1) {
                    searchedObj[colDir] = modifiedArr;
                    this.currentPageNum = 0;
                    this.perPageLocators = [];
                    this.setLocatorsArr(searchedObj, true);
                    if(res?.results.length>0) this.isSelectAllShow = true;
                  }
                }
              } else {
                this.isSelectAllShow = false;
                this.perPageLocators = [];
              }
            }
          }, error: (err:any) => console.log(err)
        });
      // if(country == "India") {
      //   const textObj = { isText: true, word: this.searchVal.toUpperCase() };
      //   const IndiaLocatorAPIs = this.apiService.getIndiaLocatorData(type, textObj);
        
      //   this.apiSubscription2 = IndiaLocatorAPIs[this.locatorType=="exporter"?0:1].subscribe(res => {
      //     if(!res?.error) {
      //       this.currentPageNum = 0;
      //       this.perPageLocators = [];
            
      //       const resObj = this.locatorType=="exporter" ? {Exp_Name: res?.results} : {Imp_Name: res?.results};
      //       this.setLocatorsArr(resObj, true);
      //       if(res?.results.length>0) this.isSelectAllShow = true;
      //     }
      //   });
      // } else {
        

      //   // this.apiSubscription2 = this.apiService.getLocatorData(dataObj, this.searchVal.toUpperCase())
      //   // .subscribe((res:any) => {
      //   //   if(!res?.error) {
      //   //     this.currentPageNum = 0;
      //   //     this.perPageLocators = [];
      //   //     this.setLocatorsArr(res?.results, true);
      //   //     if(res?.results.length>0) this.isSelectAllShow = true;
      //   //   }
      //   // });
      // }
    } 
    
    if(this.searchVal.length == 0) {
      this.currentPageNum = 0;
      this.copyArr = [...this.listArr];
      this.perPageLocators = [...this.copyArr].splice(0, 100);
      this.isSelectAllShow = false;
    }
  }

  getLocatorsByLetter(letter:string) {
    this.listArr = [];
    const locators = {};
    this.currentPageNum = 0;
    this.perPageLocators = [];
    
    if(letter == "All") {
      if(this.apiSubscription) this.apiSubscription.unsubscribe();
      this.setLocatorsArr({...this.backupLocatorData});
      return;
    }

    const bodyObj = {
      alphabet: letter,
      countryname: this.locatorObj.country,
      direction: this.locatorObj.type,
      columnname: this.locatorType=="exporter" ? "Exp_Name" : "Imp_Name"
    };

    this.apiSubscription = this.apiService.getLocatorByChar(bodyObj).subscribe((res:any) => {
      if(!res?.error) {
        locators[bodyObj.columnname] = res?.results;
        this.setLocatorsArr({...locators});
      }
    });
  }

  //it's been shut down due to searching the locators now via online api
  sortList() {
    this.copyArr = [];
    const searchLen = this.searchVal.length;
    const searchType = this.locatorType=='exporter'?'Exp_Name':'Imp_Name';

    for(let i=0; i<this.listArr.length; i++) {
      let itemSubStr = '';
      try { itemSubStr = this.listArr[i][searchType].substring(0, searchLen); } //due to null
      catch (error) { continue; }

      if((itemSubStr).toLowerCase() == (this.searchVal).toLowerCase()) {
        this.copyArr.push(this.listArr[i]);
      }
    }
  }

  //for selecting multiple values at a time
  selectValue(item) {
    const val = this.locatorType=='exporter' ? item?.Exp_Name : item?.Imp_Name;
    this.selectedArr.push(val);
  }

  //for selecting single value which is just for temporary
  selectSingleValue(e, item) {
    const isChecked = e.target.checked;
    const key = this.locatorType=='exporter' ? "Exp_Name" : "Imp_Name";
    const selectedInpArr:any = document.querySelectorAll("input[type='checkbox']:checked");
    const val =  item[key];
    
    if(isChecked) this.selectedArr.push(val);
    else this.selectedArr = this.selectedArr.filter(item => item != val);
  }

  selectAllValues(dataArr) {
    this.isMainSelect = !this.isMainSelect;
    const key = this.locatorType=='exporter' ? "Exp_Name" : "Imp_Name";
    this.selectedArr = this.isMainSelect ? dataArr.map(item => item[key]) : [];
  }

  applyLocator() {
    const selectedData = this.selectedArr.length>0 
      ? this.selectedArr 
      : this.searchVal=="" 
          ? [] : [this.searchVal.toUpperCase()];

    this.callBack.emit(selectedData);
    this.closeModal();
  }

  partitionLocator(type) {
    const limit = 100;

    const tempPageNum = (type=="next" ? this.currentPageNum+1 : this.currentPageNum-1);
    if(tempPageNum < 0) return;
    if((this.copyArr.length/limit) <= tempPageNum) {
      this.hasExceeded = true;
      return;
    }
    if([...this.copyArr].splice(tempPageNum, limit).length==0) return;
    
    type=="next" ? this.currentPageNum++ : this.currentPageNum--;
    
    const offset =  this.currentPageNum * limit;
    const partitionedArr = [...this.copyArr].splice(offset, limit);

    if(partitionedArr.length == 0) return;

    this.perPageLocators = partitionedArr
  }

  closeModal() {this.activeModal.dismiss('Cross click');}
}
