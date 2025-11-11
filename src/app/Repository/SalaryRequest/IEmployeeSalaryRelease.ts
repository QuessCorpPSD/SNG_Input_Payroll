import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IEmployeeSalaryRelease{
    EmployeeSalaryReleaseSearch(payload: any): Observable<APIResponse>;
    downloadExcel(payload: any): Observable<APIResponse>;
    DownloadTemplate(Flag: any, Qzoneusername: any, createdBy: any): Observable<APIResponse>;
    UploadSalaryHoldRequest(formData: FormData): Observable<APIResponse>;
}