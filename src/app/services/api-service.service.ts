import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observer, Observable, Subject } from 'rxjs';
import { ApiMsgRes, CompanyFetchBody, NewCompanyObj } from '../models/api.types';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  apiUrl:string = environment.apiurl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  updateFavoriteShipmentPoints(userId:number) {
    return this.http.get(this.apiUrl + `api/updateFavoriteShipment?userId=${userId}`);
  }

  addNewWorkspace(dataObj:any) {
    return this.http.post(this.apiUrl + `api/addWorkspace`, dataObj);
  }

  getWorkspace() {
    return this.http.get(this.apiUrl + `api/getWorkSpace?UserId=${this.authService.getUserId()}`)
  }  

  updateWorkspace(body:any) {
    return this.http.post(this.apiUrl + "api/updateWorkspace", body);
  }

  deleteWorkspace(Id:any){
    return this.http.post(this.apiUrl + "api/deleteWorkspace", {visibility: false, Id});
  }

  //download search data api
  getDownloadLog():any[] {
    const storage = JSON.parse(window.localStorage.getItem('download') || '[]');
    return storage;
  }

  setDownloadRecord(data:any) {
    const currentRecordsArr:any[] = this.getDownloadLog();
    currentRecordsArr.push(data);
    window.localStorage.setItem('download', JSON.stringify(currentRecordsArr));
  }


  //get Exporter and Importer data api
  getLocatorData(dataObj:any, text="") {
    const { country, type, date } = dataObj;
    const urlTxt = `${this.apiUrl}api/getImportExportList?Country=${country}&type=${type}&fromDate=${date?.from}&toDate=${date?.to}` + `${text!="" ? `&text=${text}` : ''}`;
    return this.http.get(urlTxt);
  }

  //get Exporter and Importer data api only for INDIA
  getIndiaLocatorData(direction:any, text:any={isText:false}):Observable<any>[] {
    const hasTextValue = text.isText ? `?text=${text?.word}` : "";
    const apiUrls = {
      export: ["getexporterexportindia", "getimporterexportindia"],
      import: ["getexporterimportindia", "getimporterimportindia"]
    };
    
    return [
      this.http.get<Observer<any>>(`${this.apiUrl}api/${apiUrls[direction][0]}${hasTextValue}`),
      this.http.get<Observer<any>>(`${this.apiUrl}api/${apiUrls[direction][1]}${hasTextValue}`)
    ];
  }


  //get locator data as per letter
  getLocatorByChar(body:any) {
    return this.http.post<Observer<any>>(this.apiUrl + "api/getdatabyalphabet", body);
  }

  getGlobeImpExpLocator(body:any, txt="") {
    const { direction, country } = body;
    const impExp = direction=="import" ? "im" : "ex";
    return this.http.get<Observer<any>>(this.apiUrl + `api/getcommon${impExp}port?countryname=${country}&text=${txt}`);
  }

  //-----------------download APIs-----------------//
  //to get the logs of downloaded records
  getDownloadedRecord() {
    return this.http.get(this.apiUrl + "api/getdownloadworkspace?userId=" + this.authService.getUserId());
  }

  //to get the cost per record of current country
  getCountryDownloadCost(countryCode:any){
    return this.http.get(this.apiUrl + "api/getDownloadCost?CountryCode=" + countryCode);
  }

  //to save selected records into db
  saveDownloadData(data:any) {
    const dataObj = {...data};
    if(dataObj.hasOwnProperty("ProductDesc") && dataObj["ProductDesc"].length == 0) delete dataObj["ProductDesc"];
    if(dataObj.hasOwnProperty("ProductDesc")) delete dataObj["Direction"];
    if(dataObj.hasOwnProperty("ProductDesc")) delete dataObj["IsWorkspaceSearch"];

    return this.http.post(this.apiUrl + "api/generatedownloadfiles", dataObj);
  }

  //to obtain the records to download into excel sheet
  getDownloadedData(data:any) {
    return this.http.post(this.apiUrl + "api/getdownloadData", data);
  }

  //to get product descriptional words
  getProductDescWords(word:string) {
    return this.http.get(this.apiUrl + "api/getProductDesc?product=" + word);
  }

  //to get all added countries by admin
  getAllAdminCountries() {
    return this.http.get(this.apiUrl + "api/getAllContries");
  }

  //analysis APIs
  getAnalysisData(dataObj:any) {
    return this.http.post(this.apiUrl + "api/getAnalysisReport", dataObj);
  }

  //download APIs
  generateDownload(dataObj:any) {
    return this.http.post(this.apiUrl + "api/generatedownloadfiles", dataObj);
  }

  //update latest date to country's shipment
  updateCountryDate(dataObj:any) {
    return this.http.post(this.apiUrl + "api/addimporteddatahistory", dataObj);
  }
    
  //get latest date of country's shipment
  getCountryLatestDate(countryData:any) {
    return this.http.get(this.apiUrl + `api/getlatestdate?countryName=${countryData?.country}&direction=${countryData?.direction}`);
  }

  //get All SidefilterAccess
  getAllSideFilterAccess() {
    return this.http.get(this.apiUrl + "api/getAllSideFilterAccess");
  }

  //add new Country
  addNewCountry(data:any, isUpdate=false) {
    const apiName = isUpdate ? "updateCountry" : "addCountry";
    return this.http.post(this.apiUrl + `api/${apiName}`, data);
  }

  //add new or update sidefilterAccess
  addUpdateSideFilterAccess(body:any) {
    return this.http.post(this.apiUrl + "api/addUpdateAccess", body);
  }

  //getting all main search countries list
  getAllSearchCountries() {
    return this.http.get(`${this.apiUrl}api/getcountries`);
  }


  //get all sub-user list
  getSubUsers() {
    return this.http.get(`${this.apiUrl}api/getUserslistByParentId?ParentUserId=${this.authService.getUserId()}`);
  }

  shareDownloadLink(body:any) {
    return this.http.post(`${this.apiUrl}api/sharedownloadtransaction`, body);
  }

  setDefaultUserPassword(email:string) {
    return this.http.post(`${this.apiUrl}api/resetpassword`, {Email: email});
  }

  //set user search log
  setUserSearchLog(apiObj:any) {
    return this.http.post(`${this.apiUrl}api/addlog`, apiObj);
  }

  getUserSearchLog() {
    return this.http.get(`${this.apiUrl}api/getlogs`);
  }

  setUserPlanAdditionLog(apiObj:any) {
    return this.http.post(`${this.apiUrl}api/adduseractionlog`, apiObj);
  }

  getUserPlanAdditionLog(logtype:string) {
    return this.http.get(`${this.apiUrl}api/getuseractionlogs?LogType=${logtype} Creation`);
  }

  setUserLoginLog(apiObj:any) {
    return this.http.post(`${this.apiUrl}api/adduseractivitylog`, apiObj);
  }
  getUserLoginLog() {
    return this.http.get(`${this.apiUrl}api/getuseractivitylist`);
  }
  //========================== Notification & Alert ==========================================
  getAllNotifications() {
    return this.http.get(`${this.apiUrl}api/getnotification`);
  }

  AddNewNotification(body:any) {
    return this.http.post(`${this.apiUrl}api/addnotification`, body);
  }

  getAlertMessage() {
    return this.http.get(`${this.apiUrl}api/getalertmessage?Id=1`);
  }

  updateLastAlertMsg(message:string) {
    return this.http.post(`${this.apiUrl}api/updatealertmessage`, {id: 1, message});
  }


  //========================== whatsTrending ==========================================
  getTotalCountryValue(body:any) {
    const query = `country=${body.country}&direction=${body.direction}&year=${body.year}`;
    console.log(query)
    return this.http.get(`${this.apiUrl}api/getwhatstrending?${query}`);
  }
  getTotalCompaniesValue(body:any) {
    const {country, direction, fromDate, toDate} = body;
    console.log(`${this.apiUrl}api/getlatestcountrybyvalue?country=${country}&direction=${direction}&fromDate=${fromDate}&toDate=${toDate}`)
    return this.http.get(`${this.apiUrl}api/getlatestcountrybyvalue?country=${country}&direction=${direction}&fromDate=${fromDate}&toDate=${toDate}`);
  }
  getMonthwiseRadarData(body:any, apiName:string) {
    const {country, direction, fromDate, toDate} = body;
    console.log(`${this.apiUrl}api/${apiName}?country=${country}&direction=${direction}&fromDate=${fromDate}&toDate=${toDate}`)
    return this.http.get(`${this.apiUrl}api/${apiName}?country=${country}&direction=${direction}&fromDate=${fromDate}&toDate=${toDate}`);
  }
  // getTopComapniesProductDate(body:any) {
  //   const {country, direction, fromDate, toDate} = body;
  //   return this.http.get(`${this.apiUrl}api/gettopthreeproductbycompany?country=${country}&direction=${direction}&fromDate=${fromDate}&toDate=${toDate}`);    
  // }
  getWhatstrandingGraphData(body:any) {
    const {tableType, direction, year} = body;
    return this.http.get(`${this.apiUrl}api/getWhatstrendingGraphData?year=${year}&direction=${direction.toLowerCase()}&tableType=${tableType}`);
  }

  getWhatstrandingTotalVal(year:number) {
    return this.http.get(`${this.apiUrl}api/getWhatstrendingTotalVal?year=${year}`);
  }

  //========================== Company Profile ==========================================
  getCompanyProfileCounts(body:CompanyFetchBody):Observable<ApiMsgRes> {
    return this.http.post<ApiMsgRes>(`${this.apiUrl}api/getCompanyprofile`, body);
  }

  getCompanydetails(companyname:string, country:string, direction:string):Observable<ApiMsgRes> {
    return this.http.get<ApiMsgRes>(`${this.apiUrl}api/getcompanydetails?companyname=${companyname}&country=${country}&direction=${direction}`);
  }

  getCompanyprofile(companyname:string, fromdate:string, todate:string):Observable<ApiMsgRes> {
    return this.http.get<ApiMsgRes>(`${this.apiUrl}api/getcompanyprofiledata?companyname=${companyname}&fromdate=${fromdate}&todate=${todate}`);
  }

  getCompanyInfoDetails(company:string):Observable<ApiMsgRes> {
    return this.http.post<ApiMsgRes>(`${this.apiUrl}api/getCompanyInfoData`, {company});
  }

  getCompanyListByKeyword(keyword:string):Observable<ApiMsgRes> {
    return this.http.get<ApiMsgRes>(`${this.apiUrl}api/getCompanyListBykeword?keyword=${keyword}`);
  }

  updateCompanyPoints(id:string|number):Observable<ApiMsgRes> {
    return this.http.get<ApiMsgRes>(`${this.apiUrl}api/updateCompanyPoints?userId=${id}`);    
  }

  transferCompanyDetails(body:NewCompanyObj):Observable<ApiMsgRes> {
    return this.http.post<ApiMsgRes>(`${this.apiUrl}api/transferForCompanyData`, body);
  }
}
