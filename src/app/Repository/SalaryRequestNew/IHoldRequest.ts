import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IHoldRequest {
    DownloadTemplate(Flag: any, Qzoneusername: any, createdBy: any): Observable<APIResponse>;
    SearchInvoiceHoldList(payload: any): Observable<APIResponse>;
    HoldRequestUpload(payload:any): Observable<APIResponse>;
    PartialHoldRequest(payload:any): Observable<APIResponse>;
    DBTHoldRequest(payload:any): Observable<APIResponse>;
    SingleHoldRequest(payload:any):Observable<APIResponse>;
}