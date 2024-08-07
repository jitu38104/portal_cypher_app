import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DownloadModelComponent } from 'src/app/components/homepage/components/download-model/download-model.component';
import { AlertifyService } from 'src/app/services/alertify.service';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-notification-password',
  templateUrl: './notification-password.component.html',
  styleUrls: ['./notification-password.component.css']
})
export class NotificationPasswordComponent implements OnInit{
  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private alertService: AlertifyService,
    private apiService: ApiServiceService
  ) {}

  @Input() pageType:string = "";
  
  searchInp:string = ""
  apiSubscription:Subscription;
  isEmailDropdownOn:boolean = false;
  allusers:string[] = [];
  copyAllUsers:string[] = [];
  selectedItemArr:string[] = [];

  notificationPageType:string = "alert";

  dates = {start: "", end: ""};
  message = {alert: "", push: ""};
  marqueeMsg = "";
  showPopup:boolean = false;
  isSubmitClicked:boolean = false;
  notificationType:string = "normal";

  ngOnInit(): void {
    this.apiSubscription = this.userService.getAllUser().subscribe((res:any) => {
      if(!res.error) { 
        const userList = res?.results;
        for(let i=0; i<userList.length; i++) {
          this.allusers.push(userList[i]["Email"]);
          if(i == userList.length-1) this.copyAllUsers = [...this.allusers];
        }
      }
    });
  }

  onSelectEmail(item:string) {
    this.isEmailDropdownOn = false;
    this.selectedItemArr = [item];
    this.searchInp = "";
  }

  contactFilter() {
    const txtLen = this.searchInp.length;
    this.copyAllUsers = this.allusers.filter(item => this.searchInp.toLowerCase() == (item.substring(0, txtLen)).toLowerCase());
  }

  onClickTab(elem:HTMLDivElement, elem2:HTMLDivElement) {
    elem.classList.add("active-tab");
    elem2.classList.remove("active-tab");
    
    if(this.notificationPageType == "alert") this.notificationPageType = "push";
    else this.notificationPageType = "alert";
  }

  onTypeEditor(event:any, type:string) {
    if(type == "alert") {
      this.message.alert = event.target.innerHTML;
      this.marqueeMsg = event.target.textContent;
    } else this.message.push = event.target.textContent;
  }

  onSubmitNotification() {
    const msgJson = JSON.stringify({type: this.notificationType, msg: this.message.push});
    this.apiService.AddNewNotification({message: msgJson}).subscribe({
      next: (res:any) => {
        if(!res.error) {console.log(res)}
      },
      error: (err) => {}
    });
  }

  onSubmitAlertMsg(elem:HTMLDivElement) {
    console.log(this.dates, this.message, this.showPopup);
    const jsonMsg = JSON.stringify({popup: this.message.alert, marquee: this.marqueeMsg});
    this.apiService.updateLastAlertMsg(jsonMsg).subscribe({
      next: (res:any) => {
        if(!res.error) {
          this.alertService.success("New Alert Message Added");
          this.dates = {start: "", end: ""};
          this.message.alert = "";
          this.showPopup = false;
          elem.innerHTML = "";
        }
      },
      error: () => {}
    });
  }

  onSubmitResetPass() {
    this.isSubmitClicked = true;
    this.apiService.setDefaultUserPassword(this.selectedItemArr[0]).subscribe({
      next: (res:any) => {
        if(!res.error) {
          this.isSubmitClicked = false;
          this.selectedItemArr = [];
          this.copyAllUsers = [...this.allusers];
          const modalRef2 = this.modalService.open(DownloadModelComponent, { backdrop: "static", keyboard: false, windowClass: 'downloadModalClass' });
          (<DownloadModelComponent>modalRef2.componentInstance).modalType = "password-msg";
          (<DownloadModelComponent>modalRef2.componentInstance).customMsg = 'User password has been changed successfully!';
        }
      },
      error: () => {}
    });
  }
}
