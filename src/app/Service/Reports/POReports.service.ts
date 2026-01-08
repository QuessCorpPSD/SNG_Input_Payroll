import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { APIResponse } from "../../Models/apiresponse";
import { map, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { IPOReportService } from "../../Repository/Reports/Iporeports.service";

@Injectable({
    providedIn: 'root'
})
export class POReportService implements IPOReportService {
    environment = environment
    constructor(private http: HttpClient) {
    }
    GetAllPOEmployeeReport(employeeId: string, emlpoyeeType: string): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Reports/GetAllPOEmployeeReport/${employeeId}/${emlpoyeeType}`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }
    GetPOYears(): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Reports/GetPOYears`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }
    GetVerticals(userId: string, potype: string): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Reports/GetVerticals/${userId}/${potype}`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }

    GetAllActiveInactivePO(POActiveReportParams: any): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Reports/POActiveReportGrid`;
        //console.log(url);
        return this.http.post<APIResponse>(url, POActiveReportParams);
    }

    GetAllMonthWisePOReport(txtFromDate: string, txtToDate: string): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Reports/GetAllMonthWisePOReport/${txtFromDate}/${txtToDate}`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }
}