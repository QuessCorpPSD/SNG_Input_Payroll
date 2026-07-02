import { Injectable } from '@angular/core';
import { ITimesheetService } from '../Repository/itimesheet.service';
import { Observable } from 'rxjs';
import { APIResponse } from '../Models/apiresponse';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService implements ITimesheetService {

  environment = environment;
  constructor(private http: HttpClient) {
  }

  GetEmployeeTimesheetDaywise(companyCode: string, payPeriod: string, siteCode: string,
    city_Id: string, empid: string): Observable<APIResponse> {
    console.log(this.environment.apiUrl + 'Timesheet/GetEmployeeTimesheetDaywise/' + companyCode + '/' + siteCode + '/' + empid + '/' + payPeriod + '/' + city_Id);
    return this.http.get<APIResponse>(this.environment.apiUrl + 'Timesheet/GetEmployeeTimesheetDaywise/' + companyCode + '/' + siteCode + '/' + empid + '/' + payPeriod + '/' + city_Id);
  }

  GetEmployeeTimesheetDaywiseDownload(companyCode: string, payPeriod: string, siteCode: string,
    city_Id: string, empid: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'Timesheet/GetEmployeeTimesheetDaywiseDownload/' + companyCode + '/' + siteCode + '/' + empid + '/' + payPeriod + '/' + city_Id);
  }

  UploadDailyTimesheet(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.environment.apiUrl + 'Timesheet/UploadDailyTimesheet',
      formData // send as FormData directly
    );
  }
  GetUnseizeData(companyCode: string, payPeriod: number, siteCode: string,
    city_Id: number, empid: string): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Timesheet/GetUnseizeData/${companyCode}/${payPeriod}/${siteCode}/${city_Id}/${empid}`;
    return this.http.get<APIResponse>(url);
  }

  PostUnseize(empIdJson: string, companyId: number, payPeriodId: number, siteCode: number, userId: string): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Timesheet/PostUnseize/${empIdJson}/${companyId}/${payPeriodId}/${siteCode}/${userId}`;
    console.log(url);
    return this.http.get<APIResponse>(url);
  }
  GetUnseizeAttachment(companyCode: string, siteId: number, empCode: string, payPeriod: string): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Timesheet/GetUnseizeAttachment/${companyCode}/${siteId}/${empCode}/${payPeriod}`;
    return this.http.get<APIResponse>(url);
  }
  GetUnseizeFile(formData: FormData): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Timesheet/GetUnseizeFile`;
    //console.log(url);
    return this.http.post<APIResponse>(url, formData);
  }

  UploadDocumentSingleMulitiple(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.environment.apiUrl + 'Timesheet/UploadDocumentSingleMulitiple',
      formData // send as FormData directly
    );
  }

  GetTimesheetAttachment(CompanyCode: string, Site_ID: string, Employee_Code: string,
    Payperiod: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'Timesheet/GetTimesheetAttachment/' + CompanyCode + '/' + Site_ID + '/' + Employee_Code + '/' + Payperiod);
  }

  DownloadFile(filepath: string, filename: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'Common/DownloadFile?filePath=' + filepath + '&fileName=' + filename);
  }

  SaveTimesheet(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.environment.apiUrl + 'Timesheet/SaveTimesheet',
      formData // send as FormData directly
    );
  }

  GetTimesheetDataforAudit(companyCode: string, payPeriod: number, siteCode: string,
    city_Id: string, empid: number): Observable<APIResponse> {
    console.log(this.environment.apiUrl + 'Timesheet/GetTimesheetDataforAudit/' + companyCode + '/' + siteCode + '/' + empid + '/' + payPeriod + '/' + city_Id);
    return this.http.get<APIResponse>(this.environment.apiUrl + 'Timesheet/GetTimesheetDataforAudit/' + companyCode + '/' + siteCode + '/' + empid + '/' + payPeriod + '/' + city_Id);
  }

  RejectTimesheet(rejectEmpId: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Timesheet/RejectTimesheet`;
    console.log("RejectTimesheet API:", url, rejectEmpId);
    return this.http.post<APIResponse>(url, rejectEmpId);
  }

  AttendanceReport(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Timesheet/GetAttendanceReport`;
        //console.log(url);
        return this.http.post<APIResponse>(url, formData);
    }

}

