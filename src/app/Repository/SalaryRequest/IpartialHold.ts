import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IpartialHold {
    GetUploadType(Username): Observable<APIResponse>;
    DownloadTemplate(Flag: any, Qzoneusername: any, createdBy: any): Observable<APIResponse>;
    Upload(formData: FormData): Observable<APIResponse>;

}