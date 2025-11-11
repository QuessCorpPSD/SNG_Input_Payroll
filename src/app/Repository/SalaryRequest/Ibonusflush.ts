import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface Ibonusflush {
    DownloadTemplate(Flag: any, Qzoneusername: any, createdBy: any): Observable<APIResponse>;
    Upload(formData: FormData): Observable<APIResponse>;
    downloadExcel(companyId: any, FromDate: any, ToDate: any, QZoneUserName: any): Observable<APIResponse>;

}