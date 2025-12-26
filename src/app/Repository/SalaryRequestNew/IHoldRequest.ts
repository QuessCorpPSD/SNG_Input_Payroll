import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IHoldRequest {
    DownloadTemplate(Flag: any, Qzoneusername: any, createdBy: any): Observable<APIResponse>;
}