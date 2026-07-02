import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IBankNonInvoiceNEFTCulture {
    search(companyid: any, bankcultureid: any, mode: any): Observable<APIResponse>;
    Getbankname(companyid: any, mode: any): Observable<APIResponse>;
    Create(payload: any): Observable<APIResponse>;
    getpayperiod(): Observable<APIResponse>;
    exporttoexcel(payperiod: any): Observable<APIResponse>;
    GetBusinessUnit(): Observable<APIResponse>;
}