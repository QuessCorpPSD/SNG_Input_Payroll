import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IHRAcalculation {
    GetFinancialYear(): Observable<APIResponse>;
    Search(companyId: number, employeeId: number, finYearId: number): Observable<APIResponse>;
    UploadHRA(formData: FormData): Observable<APIResponse>;
    GetEmployee(companyId: number, financialYearId: number): Observable<APIResponse>;
    GetDeclarationTypes(): Observable<APIResponse>;
    CreateupdateDelete(payload: any): Observable<APIResponse>;
    GetEmployee2(companyId: any, financialYrID: number, employeeID: number): Observable<APIResponse>;




}