import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IYearlyPayout } from '../../Repository/SalaryRequestNew/IYearlyPayout';

@Injectable({
    providedIn: 'root'
})
export class YearlyPayoutService implements IYearlyPayout {
    env = environment

    constructor(private http: HttpClient) { }

    DownloadTemplate(Flag: any, Qzoneusername: any): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/SalaryReleaseTemplate/' + Flag + '/' + Qzoneusername);
    }
    
    BonusDetailsSummary(Company_Id: any, FromDate: any, ToDate: any, Qzoneusername: any): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/BonusDetailsSummary/' + Company_Id + '/' + FromDate + '/' + ToDate + '/' + Qzoneusername);
    }

    BonusAccumatedReport(Company_Id: any, FromDate: any, ToDate: any, Qzoneusername: any): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/BonusAccumatedReport/' + Company_Id + '/' + FromDate + '/' + ToDate + '/' + Qzoneusername);
    }

    BonusReleaseUpload(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'SalaryRequestInvoice/BonusReleaseUpload',
            payload // send as FormData directly
        );
    }

    DeductionFlasuOutSearch(Company_Id: any, PayPeriodId: any, Qzoneusername: any): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/DeductionFlasuOutSearch/' + Company_Id + '/' + PayPeriodId + '/' + Qzoneusername);
    }

    DeductionFlasuOutUpload(payload: FormData): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'SalaryRequestInvoice/DeductionFlasuOutUpload',
            payload // send as FormData directly
        );
    }

}
