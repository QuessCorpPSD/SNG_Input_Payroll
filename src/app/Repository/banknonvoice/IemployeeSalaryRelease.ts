import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IemployeeSalaryRelease {
    GetEmployeeSalaryReleaseSearch(companyId: any, payPeriodId: any): Observable<APIResponse>;
    ExportEmployeeSalaryRelease(payload: any): Observable<APIResponse>;
    UploadEmployeeSalaryRelease(formData: FormData): Observable<APIResponse>
    DownloadSalaryReleaseTemplate(Flag: any, Qzoneusername: any): Observable<APIResponse>;

}