import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { APIResponse } from "../../Models/apiresponse";
import { map, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ILeaveBalanceReport } from "../../Repository/Reports/ileavebalancereport";

@Injectable({
    providedIn: 'root'
})
export class LeaveBalanceReportService implements ILeaveBalanceReport {
    environment = environment
    constructor(private http: HttpClient) {
    }

    GetAllLeaveBalanceReport(companyCode: string, siteId: string, year: string): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}LeaveBalanceReport/GetLeaveBalance`;
        const body = { companyCode, siteId, year };

        console.log("API URL:", url, "Body:", body);

        return this.http.post<APIResponse>(url, body);
    }


    GetLeaveYear(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'LeaveBalanceReport/GetLeaveYear')
    }
}