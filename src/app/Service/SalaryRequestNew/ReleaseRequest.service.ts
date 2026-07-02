import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { IHoldRequest } from '../../Repository/SalaryRequestNew/IHoldRequest';
import { IReleaseRequest } from '../../Repository/SalaryRequestNew/IReleaseRequest';

@Injectable({
    providedIn: 'root'
})
export class ReleaseRequestService implements IReleaseRequest {
    env = environment

    constructor(private http: HttpClient) { }

    DownloadTemplate(Flag: any, Qzoneusername: any): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/SalaryReleaseTemplate/' + Flag + '/' + Qzoneusername);
    }

    SearchReleaseRequest(Companay_Id: any, PayPeriod_Id: any, Qzoneusername: any): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/InvoiceNetPaysummary/' + Companay_Id + '/' + PayPeriod_Id + '/' + Qzoneusername);
    }

    ExportReleaseRequest(Companay_Id: any, PayPeriod_Id: any, Qzoneusername: any): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/NetPaysummary/' + Companay_Id + '/' + PayPeriod_Id + '/' + Qzoneusername);
    }

    GetAllHold(Companay_Id: any, PayPeriod_Id: any, Flag: any, Invoice_No: any, Qzoneusername: any): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/InvoiceWiseAssociateHoldList/' + Companay_Id + '/' + PayPeriod_Id + '/' + Flag + '/' + Invoice_No + '/' + Qzoneusername);
    }

    UploadSalaryReleaseRequest(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'SalaryRequestInvoice/UploadSalaryReleaseRequest',
            payload 
        );
    }

    SearchAllReleaseRequest(Companay_Id: any, PayPeriod_Id: any,Flag:any,InvoiceNo:any, Qzoneusername: any): Observable<APIResponse>{
        return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/InvoiceWiseAssociateHoldList/' + Companay_Id + '/' + PayPeriod_Id+ '/' + Flag + '/'+ InvoiceNo + '/' + Qzoneusername);
    }

    HoldReleaseRequest(payload:any):Observable<APIResponse>{
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'SalaryRequestInvoice/HoldReleaseRequest',
            payload 
        );
    }

    PartialHoldRelease(payload:any):Observable<APIResponse>{
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'SalaryRequestInvoice/PartialHoldRelease',
            payload 
        );
    }

    DBTHoldRelease(payload:any):Observable<APIResponse>{
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'SalaryRequestInvoice/DBTHoldRelease',
            payload 
        );
    }

    ReissueRequest(payload:any):Observable<APIResponse>{
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'SalaryRequestInvoice/ReissueRequest',
            payload 
        );
    }
}
