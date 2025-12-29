import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IHoldRequest {
    DownloadTemplate(Flag: any, Qzoneusername: any, createdBy: any): Observable<APIResponse>;
    SearchInvoiceHoldList(payload: any): Observable<APIResponse>;
    HoldRequestUpload(formData:FormData): Observable<APIResponse>;
    PartialHoldRequest(formData:FormData): Observable<APIResponse>;
    DBTHoldRequest(formData:FormData): Observable<APIResponse>;
}