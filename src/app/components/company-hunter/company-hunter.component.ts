import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiMsgRes, NewCompanyObj } from 'src/app/models/api.types';
import { AlertifyService } from 'src/app/services/alertify.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { ExcelService } from 'src/app/services/excel.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-company-hunter',
  templateUrl: './company-hunter.component.html',
  styleUrls: ['./company-hunter.component.css']
})

export class CompanyHunterComponent implements OnInit, OnDestroy{
  constructor(
    private apiService: ApiServiceService,
    private authService: AuthService,
    private alertService: AlertifyService,
    private datePipe: DatePipe,
    private userService: UserService,
    private excelService:ExcelService
  ) {}

  timeout:any;
  typedTxt:string = "";
  currentSection:string = "search";
  choosenCompanyId:number = 0;
  isFavoriteCompany:boolean = false;
  favoriteCompanyList:any[] = [];
  companyPoints:number = 0;
  companyList:string[] = [];
  companyData:any = {length:0};
  isLoading:boolean = false;
  hasDataReceived:boolean = false;
  isListInFetching:boolean = false;
  isApplyInProgress:boolean = false;
  isPadLockUnlocked:boolean = false;
  isPadLockClicked:boolean = false;
  hasAppliedForNewCompany:boolean = false;

  apiSubscription1:Subscription = new Subscription();
  apiSubscription2:Subscription = new Subscription();
  apiSubscription3:Subscription = new Subscription();
  apiSubscription4:Subscription = new Subscription();
  apiSubscription5:Subscription = new Subscription();
  apiSubscription6:Subscription = new Subscription();

  companyInfoPoints:any[] = [
    {icon: "key", key: "companyId"},
    {icon: "phone", key: "contact"},
    {icon: "user", key: "personName"},
    {icon: "envelope", key: "email"},
    {icon: "location-dot", key: "location"},
    {icon: "building", key: "address"},
    // {icon: "circle-info", key: "aboutus"}
  ];

  ngOnInit(): void {
    this.companyPoints = this.authService.getUserSingleDetail("Companyprofile");
  }

  ngOnDestroy(): void {
    this.apiSubscription1.unsubscribe();
    this.apiSubscription2.unsubscribe();
    this.apiSubscription3.unsubscribe();
    this.apiSubscription4.unsubscribe();
    this.apiSubscription5.unsubscribe();
    this.apiSubscription6.unsubscribe();
  }

  resetAllValues() {
    this.isLoading = false;
    this.isListInFetching = false;
    this.isApplyInProgress = false;
    this.isPadLockUnlocked = false;
    this.isPadLockClicked = false;
    this.hasAppliedForNewCompany = false;
  }

  onKeyUpInput(listId:string) {
    this.resetAllValues();

    if(this.typedTxt.length > 2) {
      this.apiSubscription1 = this.apiService.getCompanyListByKeyword(this.typedTxt).subscribe({
        next: (res:ApiMsgRes) => {
          this.companyList = res.results;
          if(this.timeout) {clearTimeout(this.timeout);}
          this.timeout = setTimeout(() => {
            const listTag = document.getElementById(listId) as HTMLUListElement;
            if(listTag) listTag.focus();            
          }, 200);
        }, error: (err:ApiMsgRes) => console.log(err)
      });
    } else { this.companyList = []; }  
  }

  onSearchCompany() {
    if(this.companyPoints<1) {
      this.alertService.showPackageAlert("Oops!, It seems that you have used your all Company Search points. Please recharge your Company Search points.");
      return;
    }

    this.resetAllValues();
    this.companyData = {length:0};
    this.hasDataReceived = true;
    this.isLoading = true;

    this.apiSubscription2 = this.apiService.getCompanyInfoDetails(this.typedTxt).subscribe({
      next: (res:ApiMsgRes) => {
        if(res.results.length>0) {
          const {id, iec, company_name, person_name, contact, email, location, address} = res.results[0];
          
          setTimeout(() => {
            const response = {
              recordId: id,
              companyId: iec,
              companyName: company_name,
              personName: person_name,
              contact: contact,
              email: email,
              location: location,
              address: address,
              // aboutus: "Amazon.com, Inc., doing business as Amazon, is an American multinational corporation and technology company focusing on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence."
            };
            const userPref = JSON.parse(this.authService.getUserSingleDetail("userPreference")) || {};
            this.isFavoriteCompany = Object.keys(userPref).length && userPref.hasOwnProperty("favoriteCompanies") ? userPref["favoriteCompanies"].includes(id) : false;
            this.isPadLockUnlocked = this.isFavoriteCompany;
            this.companyData = {...response, length: Object.keys(response).length};
            this.isLoading = false;
          }, 1000);
        } else { this.isLoading = false; }
      }, error: (err:ApiMsgRes) => console.log(err)
    });
  }

  onClickListItem(value:string) {
    this.typedTxt = value;
    this.companyList = [];
  }

  onFocusOutSearch() {
    this.companyList = [];
  }

  unlockPad() {
    if(this.companyPoints<1) {
      this.alertService.showPackageAlert("Oops!, It seems that you have used your all Company Search points. Please recharge your Company Search points.");
      return;
    }

    this.isPadLockClicked = true;
    const parentUserId = this.authService.getUserSingleDetail("ParentUserId"); //if it exists then current user is sub-user
    const userId:string|number = Number(parentUserId) || this.authService.getUserId();
    this.apiSubscription3 = this.apiService.updateCompanyPoints(userId).subscribe({
      next: (res:ApiMsgRes) => {
        this.isPadLockClicked = false;
        this.isPadLockUnlocked = true;
        this.companyPoints = res.results["remaining"];
        this.authService.updateUserDetails("Companyprofile", this.companyPoints);
      }, error: (err:ApiMsgRes) => console.log(err)
    });
  }

  requestForNewCompany() {
    this.isApplyInProgress = true;
    const today = new Date();
    const apiBody:NewCompanyObj = {
      company: this.typedTxt, 
      userId: Number(this.authService.getUserId()),
      dateTime: this.datePipe.transform(today, "MM/dd/yyyy, hh:mm a")
    };

    this.apiSubscription4 = this.apiService.transferCompanyDetails(apiBody).subscribe({
      next: (res:ApiMsgRes) => {
        if(res.code===200) {
          this.isApplyInProgress = false;
          this.hasAppliedForNewCompany = true;
        }
      }, error: (err:ApiMsgRes) => console.log(err)
    });
  }

  saveIntoFavorites() {
    if(this.isFavoriteCompany) return;

    (document.getElementById("listIcon") as HTMLElement).classList.add("fa-bounce");
    this.isFavoriteCompany  = true;
    const userPrefs = JSON.parse(this.authService.getUserSingleDetail("userPreference")) || {};
    if(userPrefs.hasOwnProperty("favoriteCompanies")) {
      if(!userPrefs["favoriteCompanies"].includes(this.companyData?.recordId)) {
        userPrefs["favoriteCompanies"].push(this.companyData?.recordId);
        this.setNewFavoriteCompany(JSON.stringify(userPrefs));
      }
    } else {
      userPrefs["favoriteCompanies"] = [this.companyData?.recordId];
      this.setNewFavoriteCompany(JSON.stringify(userPrefs));
    }
  }

  setNewFavoriteCompany(userPrefs:string) {
    this.apiSubscription5 = this.userService.updateUserPereference(userPrefs).subscribe({
      next: (res:ApiMsgRes) => {
        if(!res.error) {
          this.authService.updateUserDetails("userPreference", userPrefs);
          this.alertService.success("Company Added Successfully!");
        }
      }, error: (err:ApiMsgRes) => {console.log(err.message);}
    });
  }

  fetchAllFavoriteCompanies() {
    const userPrefs = JSON.parse(this.authService.getUserSingleDetail("userPreference")) || {};
    if(userPrefs.hasOwnProperty("favoriteCompanies")) {
      const favComIds = userPrefs["favoriteCompanies"];
      this.isListInFetching = true;
      this.apiSubscription6 = this.userService.getFavoriteShipment(favComIds).subscribe({
        next: (res:ApiMsgRes) => {
          if(!res.error) {
            this.favoriteCompanyList = [...res.results];
            this.isListInFetching = false;
          }
        }, error: (err:ApiMsgRes) => {
          this.isListInFetching = false;
          console.log(err.message);
        }
      });
    } else {this.favoriteCompanyList = [];}
  }

  openFavoriteCompanies(iconTag:HTMLElement) {
    iconTag.classList.remove("fa-bounce");
    this.currentSection = 'list';
    this.fetchAllFavoriteCompanies();
  }

  onDownloadExcelFile() {
    if(this.favoriteCompanyList.length==0) return;

    const tempCompaniesList = JSON.parse(JSON.stringify(this.favoriteCompanyList));
    tempCompaniesList.map((item:any) => delete item["id"]);
    const today = new Date();
    const filename = `Companies_List_${this.alertService.dateInFormat(today).replace(new RegExp("-", "g"), "")}`;
    this.excelService.exportAsExcelFile(tempCompaniesList, filename);
  }
}
