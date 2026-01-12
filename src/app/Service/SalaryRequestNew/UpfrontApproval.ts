import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IYearlyPayout } from '../../Repository/SalaryRequestNew/IYearlyPayout';
import { IUpfrontApproval } from '../../Repository/SalaryRequestNew/IUpfrontApproval';

@Injectable({
    providedIn: 'root'
})
export class UpfrontApprovalService implements IUpfrontApproval {
    env = environment

    constructor(private http: HttpClient) { }

    UpfrontViewInvoice(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'UpfrontRequest/UpfrontViewInvoice',
            payload // send as FormData directly
        );
    }

    CalculateUpfrontValue(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'UpfrontRequest/ViewUpfrontValue',
            payload // send as FormData directly
        );
    }

    RequestUpfront(payload: FormData): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'UpfrontRequest/RequestUpfront',
            payload // send as FormData directly
        );
    }

    ViewBulkApprovalInvoices(Approverid: any): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'UpfrontRequest/ViewBulkApprovalInvoices/' + Approverid);
    }

    UpfrontRequestApprove(payload: FormData): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'UpfrontRequest/UpfrontRequestApprove',
            payload // send as FormData directly
        );
    }

     UpfrontRequestReject(payload: FormData): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'UpfrontRequest/UpfrontRequestReject',
            payload // send as FormData directly
        );
    }

}
