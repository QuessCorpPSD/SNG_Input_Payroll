import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { APIResponse } from "../../Models/apiresponse";
import { map, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ITimesheetSummary } from "../../Repository/Reports/itimesheetsummary.service";
@Injectable({
    providedIn: 'root'
})
export class TimesheetSummaryService implements ITimesheetSummary {
    environment = environment
    constructor(private http: HttpClient) {
    }
    GetLeaveYear(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'LeaveBalanceReport/GetLeaveYear')
    }
    GetLocation(companyId: any, siteId: any): Observable<any> {
        const url = `${environment.apiUrl}Common/Getlocation/${companyId}/${siteId}`;
        return this.http.get<any>(url);
    }
     GetAllTimesheetSummaryReport(companyId: any, siteId: any, Location: string, payPeriodId: string,status:string): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}TimesheetSummaryReport/GetTSSummaryReport`;
        const body = { companyId, siteId, Location, payPeriodId,status };
        console.log("API URL:", url, "Body:", body);
        return this.http.post<APIResponse>(url, body);
    }

}

