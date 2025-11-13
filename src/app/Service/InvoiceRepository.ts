import { Injectable } from "@angular/core";
import { IInvoiceRepository } from "../Repository/IInvoiceRepository";
import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";
import { environment } from "../../environments/environment.development";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class InvoiceRepository implements IInvoiceRepository {
    environment = environment;
    constructor(private http: HttpClient) {

    }

    BillableSearch(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);

        const config = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + "BillableDays/SearchDetails", inputval, { headers: config })
    }
    BillableDaysSearchExport(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + "BillableDays/ExportToExcel", inputval, { headers: config })
    }
    BillableUpload(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }).set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + "BillableDays/BillableDaysUpload", inputval, { headers: config })
    }
    BillableTemplateDownload(importtype): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'BillableDays/DownloadTemplate/' + importtype);
    }

    Search(val): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}InvoiceInitiation/Search`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }

    InitialSearch(val): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}InvoiceInitiation/InitiationSearch`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }
    InitiationSearchExport(val): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}InvoiceInitiation/InitiationSearchExport`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }
    InvoiceInitiate(val): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}InvoiceInitiation/InvoiceInitiate`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }
    ExportToExcel(val): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}InvoiceInitiation/ExportToExcel`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }


    GetAllInvoiceDetails(companyId: number, payPeriodId: number, userId: string): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Invoice/GetAllInvoiceDetails/${companyId}/${payPeriodId}/${userId}`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }

    UploadReject(formData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Onboarding/PostUploadReject`;
        //console.log(url)
        return this.http.post<APIResponse>(url, formData);
    }

    UploadCancel(formData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Onboarding/PostCancelReject`;
        //console.log(url)
        return this.http.post<APIResponse>(url, formData);
    }
    GetGSTInvoice(userId: number): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}GSTInvoice/GetGSTInvoice/${userId}`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }
}