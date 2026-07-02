import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { APIResponse } from "../../Models/apiresponse";
import { IAttendanceProcessRepository } from "../../Repository/Process/IAttendnaceProcessRepository";

@Injectable({
    providedIn: 'root'
})
export class AttendanceProcessRepository implements IAttendanceProcessRepository {
    environment = environment;
    constructor(private http: HttpClient) {
    }
    SearchDetails(val): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}AttendanceProcess/SearchDetails`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers: config });
    }

    ExporttoExcel(val): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}AttendanceProcess/ExporttoExcel`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers: config });
    }

    ImportAttendnace(formData: FormData): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.environment.apiUrl + 'AttendanceProcess/ImportAttendnace',
            formData // send as FormData directly
        );
    }
}