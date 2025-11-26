import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IServiceCharge {
    UploadOneTime(formData: FormData): Observable<APIResponse>;
    GetServiceCharge(): Observable<APIResponse>;
    GetServicechargetype(companyid: any): Observable<APIResponse>;


}