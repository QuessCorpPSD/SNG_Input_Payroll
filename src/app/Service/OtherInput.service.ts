import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { APIResponse } from "../Models/apiresponse";
import { Observable } from "rxjs";
import { IOtherInputServices } from "../Repository/IOtherInput.service";

@Injectable({
    providedIn: 'root'
})
export class OtherInputServices implements IOtherInputServices {
    environment = environment;
    constructor(private http: HttpClient) { }

    GetGratuityTemplate(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}OtherInput/GetGratuityTemplate`;
        console.log(url);
        return this.http.post<APIResponse>(url, formData);
    }

    GetGratuityReview(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}OtherInput/GetGratuityReview`;
        return this.http.post<APIResponse>(url, formData);
    }
    PostGratuityAttendanceData(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}OtherInput/PostGratuityAttendanceData`;
        return this.http.post<APIResponse>(url, formData);
    }

    GetNCPPayregisterTemplate(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}OtherInput/GetNCPPayregisterTemplate`;
        console.log(url);
        return this.http.post<APIResponse>(url, formData);
    }

    PostNCPPayregisterUpload(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}OtherInput/PostNCPPayregisterUpload`;
        return this.http.post<APIResponse>(url, formData);
    }
    GetAllInvoiceRule(companyId:number, siteId:string):Observable<APIResponse>{
        const url = `${this.environment.apiUrl}OtherInput/GetAllInvoiceRule/${companyId}/${siteId}`;
        console.log(url);
        return this.http.get<APIResponse>(url);
    }
}