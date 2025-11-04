import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { APIResponse } from "../../Models/apiresponse";
import { map, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ILeaveBalanceReport } from "../../Repository/Reports/ileavebalancereport";
import { IIqitsBillingReport } from "../../Repository/Reports/iqitsbillingreport.service";

@Injectable({
    providedIn: 'root'
})
export class QITSBillingReportService implements IIqitsBillingReport{
    environment = environment   
    constructor(private http: HttpClient) {
    }
        GetLeaveYear(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'LeaveBalanceReport/GetLeaveYear')
    }

        GetAllBillingReport(companyId: string, siteId: string, payPeriodId: string): Observable<APIResponse>{
            const url = `${this.environment.apiUrl}BillingReport/GetBillingReport`;
            const body = { companyId, siteId, payPeriodId };
            console.log("API URL:", url, "Body:", body);
            return this.http.post<APIResponse>(url, body);
        }


    

}