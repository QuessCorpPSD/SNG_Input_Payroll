import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface ILtaCalculation {
    search(companyId: any, employeeId: any): Observable<APIResponse>;
    importLtaCalculation(payload: any): Observable<APIResponse>;
    getBlockPeriod(): Observable<APIResponse>;
    exportToExcel(companyId: any, employeeId: any): Observable<APIResponse>;
    addLta(payload: any): Observable<APIResponse>;
    getFinancialYear(): Observable<APIResponse>;
    getType(): Observable<APIResponse>;
    getEmployeeCode(companyId: any): Observable<APIResponse>;
    getemployeename(financialYearId: any, EmployeeId: any): Observable<APIResponse>;
}