import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IBankAccount {
    
    BankDetailsSearch(Company_Id: any): Observable<APIResponse>;
    BankDetailsUpload(payload: any): Observable<APIResponse>;
    DownloadTemplate(Flag: any, Qzoneusername: any): Observable<APIResponse>;
    BankApprovalSearch(Company_Id: any): Observable<APIResponse>;
    BankApprovalApproveReject(payload: any): Observable<APIResponse>;
}