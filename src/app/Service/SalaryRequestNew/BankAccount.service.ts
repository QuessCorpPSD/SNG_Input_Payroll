import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IBankAccount } from '../../Repository/SalaryRequestNew/IBankAccount';

@Injectable({
    providedIn: 'root'
})
export class BankAccountService implements IBankAccount {
    env = environment

    constructor(private http: HttpClient) { }    
    
    BankDetailsSearch(Company_Id: any): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/BankDetailsSearch/' + Company_Id );
    }

    BankDetailsUpload(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'SalaryRequestInvoice/BankDetailsUpload',
            payload // send as FormData directly
        );
    }

    DownloadTemplate(Flag: any, Qzoneusername: any): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/SalaryReleaseTemplate/' + Flag + '/' + Qzoneusername);
    }

    BankApprovalSearch(Company_Id: any): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/BankApprovalSearch/' + Company_Id);
    }

    BankApprovalApproveReject(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'SalaryRequestInvoice/BankApprovalApproveReject',
            payload // send as FormData directly
        );
    }

}
