import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { APIResponse } from "../../Models/apiresponse";
import { IArrearAttendanceProcessRepository } from "../../Repository/Process/IArrearAttendanceProcessRepository";


@Injectable({
    providedIn: 'root'
})
export class ArrearAttendanceProcessRepository implements IArrearAttendanceProcessRepository {
    environment = environment;
    constructor(private http: HttpClient) {
    }
    SearchDetails(val): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}ArrearAttendanceProcess/SearchDetails`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers: config });
    }

    ExporttoExcel(val): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}ArrearAttendanceProcess/SearchDetails`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers: config });
    }

    ImportArrearAttendnace(formData: FormData): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.environment.apiUrl + 'ArrearAttendanceProcess/ImportArrearAttendnace',
            formData // send as FormData directly
        );
    }
}