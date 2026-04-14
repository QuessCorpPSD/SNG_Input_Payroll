import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class BankAdviceSplitCultureService {

    env = environment

    constructor(private http: HttpClient) { }

    search(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(this.env.apiUrl + 'SplitCulture/search', payload)
    }

    GetMapName(companyId: any): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'SplitCulture/getmapname/' + companyId)
    }

    Save(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(this.env.apiUrl + 'SplitCulture/save', payload)
    }

    UploadBankInvoiceSplit(formData: FormData): Observable<APIResponse> {
        return this
            .http.post<APIResponse>(
                this.env.apiUrl + 'SplitCulture/UploadBankInvoiceSplit',
                formData
            );
    }

}
