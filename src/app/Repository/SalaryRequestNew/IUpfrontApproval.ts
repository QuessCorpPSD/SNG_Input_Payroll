import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IUpfrontApproval {
    UpfrontViewInvoice(payload: any): Observable<APIResponse>;
    CalculateUpfrontValue(payload: any): Observable<APIResponse>;
    RequestUpfront(payload: FormData): Observable<APIResponse>;
    ViewBulkApprovalInvoices(ApproverId: any): Observable<APIResponse>;
    UpfrontRequestApprove(payload: any): Observable<APIResponse>;
    UpfrontRequestReject(payload: any): Observable<APIResponse>;
}