import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { IPayProcessRepository } from "../../Repository/Process/IPayProcessRepository";
import { environment } from "../../../environments/environment.development";
import { APIResponse } from "../../Models/apiresponse";

@Injectable({
    providedIn: 'root'
})
export class PayProcessRepository implements IPayProcessRepository {
    environment = environment;
    constructor(private http: HttpClient) {
    }
    GetITCalenderCompany(val): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}PayProcess/GetITCalenderCompany`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers: config });
    }

    PayProcess(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.environment.apiUrl + 'PayProcess/ReProcess',
            payload
        );
    }

    FandFPayProcess(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.environment.apiUrl + 'PayProcess/FandFReProcess',
            payload // send as FormData directly
        );
    }
}