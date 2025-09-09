import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../Models/apiresponse';


export interface ITimesheetService {

  GetEmployeeTimesheetDaywise(companyCode: string, payPeriod: string, siteCode: string,
    city_Id: string, empid: string): Observable<APIResponse>;

  GetEmployeeTimesheetDaywiseDownload(companyCode: string, payPeriod: string, siteCode: string,
    city_Id: string, empid: string): Observable<APIResponse>;

  UploadDailyTimesheet(formData: FormData): Observable<APIResponse>;
  GetUnseizeData(companyCode: string, payPeriod: number, siteCode: string, city_Id: number, empid: string): Observable<APIResponse>;
  PostUnseize (empIdJson: string,companyId: number, payPeriodId: number, siteCode: number, userId: string):Observable<APIResponse>;
  GetUnseizeAttachment(companyCode: string, siteId: number, empCode: string, payPeriod: string):Observable<APIResponse>;
  GetUnseizeFile(formData:FormData):Observable<APIResponse>;

  UploadDocumentSingleMulitiple(formData: FormData): Observable<APIResponse>;

  GetTimesheetAttachment(CompanyCode:string,Site_ID:string,Employee_Code:string,
    Payperiod:string)  : Observable<APIResponse>;

    DownloadFile(filepath:string,filename:string)  : Observable<APIResponse>;

    SaveTimesheet(payload:any):Observable<APIResponse>;
}
