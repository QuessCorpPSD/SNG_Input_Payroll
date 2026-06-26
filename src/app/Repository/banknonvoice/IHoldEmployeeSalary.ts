import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IHoldEmployeeSalary {
    GetSalaryHoldType(): Observable<APIResponse>;
    SearchHoldEmpSalary(companyId: any, payPeriodId: any, status: any): Observable<APIResponse>;
    ExportHoldEmpSalary(payload: any): Observable<APIResponse>;
    UploadHoldEmpSalary(formData: FormData): Observable<APIResponse>;
    DownloadHoldTemplate(flag: string, userId: string);


}