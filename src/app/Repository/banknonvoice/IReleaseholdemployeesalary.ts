import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IReleaseholdemployeesalary {

    SearchReleaseHoldSalary(Company_Id: any, Pay_Period_Id: any, Employee_Id: any): Observable<APIResponse>;
    ExportReleaseHoldSalary(payload: any): Observable<APIResponse>;
    SaveReleaseHoldSalary(payload: any): Observable<APIResponse>;
    UploadReleaseHoldSalary(formData: FormData): Observable<APIResponse>;
    DownloadReleaseHoldTemplate(flag: any, userId: any): Observable<APIResponse>;


}