import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { APIResponse } from "../../Models/apiresponse";
import { map, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { IInvoiceLeaveBalanceReport } from "../../Repository/Reports/iinvoiceleavebalancereport.service";
@Injectable({
    providedIn: 'root'
})
export class InvoiceLeaveBalanceReportService implements IInvoiceLeaveBalanceReport {
    environment = environment
    constructor(private http: HttpClient) {
    }
    GetLeaveYear(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'LeaveBalanceReport/GetLeaveYear')
    }

    GetAllInvoiceLeaveBalanceReport(companyId: string, siteId: string, frommonth: string, fromyear: string, tomonth: string, toyear: string): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}InvoiceLeaveBalanceReport/GetLeaveBalance`;
        const body = { companyId, siteId, frommonth, fromyear, tomonth, toyear };
        console.log("API URL:", url, "Body:", body);
        return this.http.post<APIResponse>(url, body);
    }

}