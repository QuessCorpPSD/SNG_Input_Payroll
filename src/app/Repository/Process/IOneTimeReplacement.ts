import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IOneTimeReplacement {
    OneTimeSearch(payload: any): Observable<APIResponse>;
    downloadExcel(payload: any): Observable<APIResponse>;
    UploadOneTime(formData: FormData): Observable<APIResponse>;
    GetEmployeesByCompanyId(payload: any): Observable<APIResponse>
}