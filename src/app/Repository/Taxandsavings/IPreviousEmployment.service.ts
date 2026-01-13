import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IPreviousEmployment {
    search(companyId: any, employeeId: any): Observable<APIResponse>;
    importLtaCalculation(payload: any): Observable<APIResponse>;
    exportToExcel(companyId: any, employeeId: any): Observable<APIResponse>;
    getFinancialYear(): Observable<APIResponse>;
    addPeta(payload: any): Observable<APIResponse>;
    getType(): Observable<APIResponse>;
    getEmployeeCode(companyId: any): Observable<APIResponse>;
    getemployeename(financialYearId: any, EmployeeId: any): Observable<APIResponse>
}