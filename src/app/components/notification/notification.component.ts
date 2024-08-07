import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EllipsisPipe } from 'src/app/common/Pipes/ellipsis.pipe';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { EventemittersService } from 'src/app/services/eventemitters.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit{
  constructor(
    private apiService: ApiServiceService,
    private userService: UserService,
    private authService: AuthService,
    public ellipsePipe: EllipsisPipe,
    private eventService: EventemittersService
  ) {}

  apiSubscription:Subscription;
  notificationArr:any[] = [];
  copyNotificationArr:any[] = [];
  unseenIDs:string[] = [];
  isLoading:boolean = true;

  ngOnInit(): void {
    this.eventService.vanishNotificationCount.next(true);

    this.apiSubscription = this.apiService.getAllNotifications().subscribe({
      next: async(res:any) => {
        if(!res.error) {
          const allSeenIds = [];
          this.isLoading = false;
          this.notificationArr = res?.results;
          this.copyNotificationArr = JSON.parse(JSON.stringify(this.notificationArr));
          
          for(let i=0; i<this.notificationArr.length; i++) {
            allSeenIds.push(Number(this.notificationArr[i]["Id"]));
            this.copyNotificationArr[i]["message"] = this.ellipsePipe.transform(this.copyNotificationArr[i]["message"], 200);

            if(this.notificationArr.length == i+1) this.setToUserPrefAPI(allSeenIds);
          }
        }
      }
    })
  }

  expandMsg(elem1:HTMLSpanElement, elem2Id, id) {
    const divTag = document.getElementById(elem2Id) as HTMLDivElement;
    if(elem1.innerText == "Read more") {
      elem1.innerText = "Read less";
      divTag.style.maxHeight = "100%";
      this.applyEllipses("expand", id);
    } else {
      elem1.innerText = "Read more";
      divTag.style.maxHeight = "20%";
      this.applyEllipses("shrink", id);
    }
  }

  applyEllipses(type:string, id) {
    this.copyNotificationArr.map((item, index) => {
      if(item?.Id == id) {
        if(type == "expand") item["message"] = this.notificationArr[index]["message"];
        else item["message"] = this.ellipsePipe.transform(item["message"], 200);
      }
    });
  }

  setToUserPrefAPI(ids:any[]) {
    const userPreference = (this.authService.getUserDetails())["userPreference"];
    const preferenceInObj = userPreference!=null ? JSON.parse(userPreference) : {};
    preferenceInObj["notification"] = ids;
    const stringyPrefs = JSON.stringify(preferenceInObj);

    this.userService.updateUserPereference(stringyPrefs).subscribe({
      next: (res:any) => {
        const currentUserData = this.authService.getUserDetails();
        currentUserData["userPreference"] = stringyPrefs;
        window.localStorage.setItem("currentUser", JSON.stringify(currentUserData));
      },
      error: (err) => {}
    });
  }
}
