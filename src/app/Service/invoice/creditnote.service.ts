import { Injectable } from "@angular/core";
import { IInvoiceRepository } from "../../Repository/invoice/IInvoiceRepository";
import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { ICreditNoteRepository } from "../../Repository/invoice/IcreditnoteRepository";

@Injectable({
    providedIn: 'root'
})
export class CreditNoteService implements ICreditNoteRepository {
    environment = environment;
    constructor(private http: HttpClient) {
    }

    GetCreditNotePurpose(companyId: number): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}CreditNote/GetCreditNotePurpose/${companyId}`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }

    CreditNoteSearch(CreditNoteSearch: any): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}CreditNote/GetCreditNoteSearch`;
        //console.log(url);
        return this.http.post<APIResponse>(url, CreditNoteSearch)
    }

    UploadCreditNoteRequest(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}CreditNote/UploadCreditNoteRequest`;
        console.log(url);
        return this.http.post<APIResponse>(url, formData)
    }

    ExportCreditNoteRequest(CreditNoteSearch: any): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}CreditNote/ExportCreditNoteRequest`;
        //console.log(url);
        return this.http.post<APIResponse>(url, CreditNoteSearch)
    }

    CreditNoteApproveSearch(CreditNoteSearchApprove: any): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}CreditNoteApprove/GetCreditNoteSearch`;
        console.log(url);
        return this.http.post<APIResponse>(url, CreditNoteSearchApprove)
    }

    UploadCreditNoteApprove(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}CreditNoteApprove/UploadCreditNoteRequest`;
        console.log(url);
        return this.http.post<APIResponse>(url, formData)
    }

    CreditNoteUpdateSearch(CreditNoteSearchApprove: any): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}CreditNoteUpdate/GetCreditNoteSearch`;
        console.log(url);
        return this.http.post<APIResponse>(url, CreditNoteSearchApprove)
    }

    UploadCreditNoteCancel(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}CreditNoteUpdate/UploadCreditNoteCancel`;
        console.log(url);
        return this.http.post<APIResponse>(url, formData)
    }
    
    DownloadInvoice(CreditNoteid: number, CompanyId: number, InvoiceNumber: number, InvoiceID: number): Observable<HttpResponse<Blob>> {
        const url = `${this.environment.apiUrl}CreditNoteUpdate/Download/${CreditNoteid}/${CompanyId}/${InvoiceNumber}/${InvoiceID}`;
        return this.http.get(url, { responseType: 'blob', observe: 'response' });
    }
}