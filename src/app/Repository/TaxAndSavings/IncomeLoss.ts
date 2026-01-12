import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IncomeLoss {
    Search(companyId: number, employeeId: number): Observable<APIResponse>;
    UploadIncome(formData: FormData): Observable<APIResponse>;
    GetTypes(): Observable<APIResponse>;
    GetFinancialYear(): Observable<APIResponse>;
    Create(payload: any): Observable<APIResponse>;
    GetEmployee(companyId: number, financialYearId: number): Observable<APIResponse>;
    GetEmployee2(companyId: any, financialYrID: number, employeeID: number): Observable<APIResponse>;
    getEmpCode(companyId: any): Observable<APIResponse>;
}