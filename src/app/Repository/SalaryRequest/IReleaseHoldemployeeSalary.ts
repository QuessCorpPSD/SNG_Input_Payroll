import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IReleaseHoldemployeeSalary {

    HoldReleaseEmployeSearch(payload: any): Observable<APIResponse>;
    HoldReleaseRequest(payload: any): Observable<APIResponse>;
    DownloadTemplate(Flag: any, Qzoneusername: any, createdBy: any): Observable<APIResponse>;
    UploadRequest(formData: FormData): Observable<APIResponse>;
}