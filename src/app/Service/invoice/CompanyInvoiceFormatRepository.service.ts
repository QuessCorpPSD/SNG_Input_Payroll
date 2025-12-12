import { Injectable } from "@angular/core";
import { IInvoiceRepository } from "../../Repository/invoice/IInvoiceRepository";
import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";
import { environment } from "../../../environments/environment.development";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { ICompanyInvoiceFormatRepository } from "../../Repository/invoice/ICompanyInvoiceFormat";

@Injectable({
    providedIn: 'root'
})
export class CompanyInvoiceFormatRepository implements ICompanyInvoiceFormatRepository {
    environment = environment;
    constructor(private http: HttpClient) {
    }

    GetAllCompanyInvoiceFormat(userId: number): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}CompanyInvoiceFormat/GetAllCompanyInvoiceFormat/${userId}`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }

    GetAllInvoiceType(): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}CompanyInvoiceFormat/GetAllInvoiceType`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }

    GetAllInvoiceFormat(): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}CompanyInvoiceFormat/GetAllInvoiceFormat`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }

    CompanyInvoiceFormatAddsave(InvoiceFormatAdd: any): Observable<string> {
        return this.http.post(
            this.environment.apiUrl + 'CompanyInvoiceFormat/AddInvoiceFormat',
            InvoiceFormatAdd,
            { responseType: 'text' }
        );
    }

    CompanyInvoiceFormatEditsave(InvoiceFormatAdd: any): Observable<string> {
        return this.http.post(
            this.environment.apiUrl + 'CompanyInvoiceFormat/AddInvoiceFormat',
            InvoiceFormatAdd,
            { responseType: 'text' }
        );
    }
}