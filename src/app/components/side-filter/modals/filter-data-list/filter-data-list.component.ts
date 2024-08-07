import { Component, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventemittersService } from 'src/app/services/eventemitters.service';
import {Subscription} from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';


@Component({
  selector: 'app-filter-data-list',
  templateUrl: './filter-data-list.component.html',
  styleUrls: ['./filter-data-list.component.css']
})
export class FilterDataListComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() emitSelectedData:EventEmitter<any[]> = new EventEmitter();
  selectedDataArr:any[] = [];
  selectedIds:string[] = [];
  filterNameKey:any = {}
  filterName:string = "";
  listDataArr:any[] = [];
  copiedDataArr:any[] = [];
  alreadySelectedItems:any[] = [];
  hasDataReceived:boolean = false;
  eventSubscription:Subscription;
  currentCountry:string = "";
  exceptionalSideFilter:string[] = ["Exporter", "Importer", "Country"];
  convertor:Function = this.alertService.valueInBillion;

  constructor(
    private alertService: AlertifyService,
    public activeModal: NgbActiveModal,
    public eventService: EventemittersService
  ) { }

  ngOnInit(): void {
    //it receives the data of filter option like export, import to list out in the modal
    // this.eventSubscription = this.eventService.filterModalDataEvent.subscribe(res => {
    //   this.listDataArr = res.data;
    //   this.copiedDataArr = res.data;
    //   this.hasDataReceived = true;
    // });
    this.getCurrentCountry();
    this.filterName = this.filterNameKey?.name.toLowerCase(); 
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      for(let item of this.alreadySelectedItems) {
        const splittedArr = (item["id"]).split("_");
        splittedArr.shift();
        const newId = `${splittedArr.join("_")}_modal`;
        const checkboxTag = document.getElementById(newId) as HTMLInputElement;
        checkboxTag.checked = true;
        this.selectedIds.push(newId);
        this.selectedDataArr.push(item);
      }
    }, 800);
  }

  ngOnDestroy(): void {
    // this.eventSubscription.unsubscribe();
  }

  onSubmitData() {
    this.emitSelectedData.emit(this.selectedDataArr);
    this.onDismissModal();
  }

  startBindingData(res:string[]) {
    this.listDataArr = (typeof res[0] == "string") ? res.sort()
      : res.sort((a,b) => (a[this.filterNameKey["key"]] > b[this.filterNameKey["key"]]) ? 1 : ((b[this.filterNameKey["key"]] > a[this.filterNameKey["key"]]) ? -1 : 0));

    //in case of null value existence
    if((typeof res[0] == "string") && this.listDataArr.includes(null)) {
      const nullLength = this.listDataArr.filter(item => item==null).length;

      for(let i=0; i<nullLength; i++){
        this.listDataArr.splice(this.listDataArr.indexOf(null), 1); 
      }
    } else {this.listDataArr = this.detectNullVal(this.listDataArr);}
    
    this.copiedDataArr = res.sort();
    this.hasDataReceived = true;
  }

  detectNullVal(optionArr:any[]):any[] {
    const optionLen = optionArr.length;
    const copyArr = JSON.parse(JSON.stringify(optionArr));

    for(let i=0; i<optionLen; i++) {
      if(typeof optionArr[i] == "string" && [null, undefined].includes(optionArr[i])) copyArr.splice(i, 1);
      else if(typeof optionArr[i] != "string" && [null, undefined].includes(optionArr[i][this.filterNameKey["key"]])) copyArr.splice(i, 1);

      if(i==optionLen-1) return copyArr;
    }
  }


  onSelectData(e, value, id) {
    const newId = `${this.replaceSpace(this.filterName, "other")}_${this.replaceSpace(value, "other")}`;

    if(e.target.checked) { this.selectedDataArr.push({value, id: newId}); } 
    else {
      const tempArr = this.selectedDataArr.filter(item => item?.id != newId);
      this.selectedDataArr = tempArr;
    }
    e.target.checked ? this.selectedIds.push(e.target.id) : this.selectedIds.splice(this.selectedIds.indexOf(e.target.id), 1);
  }

  //for searching specific or related data
  onchangeSearch(e) {
    const currentVal = (e.target.value).toLowerCase();
    let tempArr = [];
    if(typeof this.listDataArr[0] == "string") {
      tempArr = this.listDataArr.filter(obj => (obj.toLowerCase()).includes(currentVal));
    } else {
      tempArr = this.listDataArr.filter(obj => (obj[this.filterNameKey.key].toLowerCase()).includes(currentVal));
    }
    this.copiedDataArr = [...tempArr].sort(); 
  }

  onDismissModal = () => this.activeModal.dismiss('Cross click');

  getValueFromObj(item:any) {
    if(typeof item == "string") return item;
    else return item[this.filterNameKey["key"]];
  }

  replaceSpace(name, type="self"):string {
    if(typeof name == "string") {
      return type == "other" ? (name+'').replace(new RegExp(' ', 'g'), '_').toLowerCase()
      : (name+'').replace(new RegExp(' ', 'g'), '_').toLowerCase()+"_modal";
    } else {
      return type == "other" ? (name[this.filterNameKey["key"]]+'').replace(new RegExp(' ', 'g'), '_').toLowerCase()
      : (name[this.filterNameKey["key"]]+'').replace(new RegExp(' ', 'g'), '_').toLowerCase()+"_modal";
    }
  }

  isChecked = (id) => this.selectedIds.includes(id);

  closeModal() {this.activeModal.dismiss('Cross click');}

  getCurrentCountry() {
    this.eventSubscription = this.eventService.currentCountry.subscribe({
      next: (res:any) => {this.currentCountry = ["", "India"].includes(res?.country)?"INDIA":"";}, 
      error: (err:any) => console.log("Error:", err)
    });
  }
}
