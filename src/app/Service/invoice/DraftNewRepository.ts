import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";
import { environment } from "../../../environments/environment.development";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { IDraftNewRepository } from "../../Repository/invoice/IDraftNewRepository";


@Injectable({
    providedIn: 'root'
})
export class DraftNewRepository implements IDraftNewRepository {
    environment = environment;
    constructor(private http: HttpClient) {
    }
    GetPerformaInvoice(CompanyId: string, PayPriod: string, userId: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'DraftNew/GetPerformaInvoice/' + CompanyId + '/' + PayPriod + '/' + userId);
    }

    PerformaInvoiceSplit(formData: FormData): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.environment.apiUrl + 'DraftNew/PerformaInvoiceSplit',
            formData
        );
    }
    InvoiceBackDated(companyId, payfrequencyid): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'DraftNew/InvoiceBackdated/' + companyId + '/' + payfrequencyid)
    }
    GetAllAttributeAddAndUpdate(val): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}Attributes/AttributeAddUpdate`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }
    GetAllAttribute(val): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}Attributes/GetAllAttribute`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }

    PerformaInvoiceMerge(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.environment.apiUrl + 'DraftNew/PerformaInvoiceMerge',
            payload
        );
    }

    PerformaInvoiceInitiate(payload: any): Observable<APIResponse> {
        console.log('Sending PO save payload:', JSON.stringify(payload));
        return this.http.post<APIResponse>(
            this.environment.apiUrl + 'DraftNew/PerformaInvoiceInitiate',
            payload
        );
    }

    UpdateMapName(formData: FormData): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.environment.apiUrl + 'DraftNew/UpdateMapName',
            formData
        );
    }

    UploadAttributes(formData: FormData): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.environment.apiUrl + 'DraftNew/UploadAttributes',
            formData
        );
    }

    PerformaInvoiceMergeNew(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.environment.apiUrl + 'DraftNew/PerformaInvoiceMergeNew',
            payload
        );
    }

    GetSplitTemplate(SplitParams: any): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}DraftNew/GetSplitTemplate`;
        console.log(url);
        return this.http.post<APIResponse>(url, SplitParams)
    }

    PostPushData(PushModel: any): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}DraftNew/PostInvoicePush`;
        console.log(url);
        return this.http.post<APIResponse>(url, PushModel)
    }

    GetDraftInformation(CompanyId: string, PayPriod: string, userId: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'DraftNew/GetDraftInformation/' + CompanyId + '/' + PayPriod + '/' + userId);
    }
    PerformaInvoiceSkip(payload: any): Observable<APIResponse> {
        console.log('Sending Skip Payload:', JSON.stringify(payload));
        return this.http.post<APIResponse>(
            this.environment.apiUrl + 'DraftNew/PerformaInvoiceSkip',
            payload
        );
    }
}