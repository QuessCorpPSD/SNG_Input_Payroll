import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface ITaxdeclarationandactual {
    search(companyId: any, employeeId: any): Observable<APIResponse>;
    importLtaCalculation(payload: any): Observable<APIResponse>;
    exportToExcel(companyId: any, employeeId: any): Observable<APIResponse>;
    addTax(payload: any): Observable<APIResponse>;
    getFinancialYear(): Observable<APIResponse>;
    getTaxCode(): Observable<APIResponse>;
    getEmployeeCode(companyId: any, financialYearId: any): Observable<APIResponse>;
    getType(): Observable<APIResponse>;
    getemployeename(financialYearId: any, EmployeeId: any): Observable<APIResponse>;
    getEligibleAmount(Employee_Id: any, Financial_Year_Id: any, Computation_Rule_Id: any): Observable<APIResponse>;
    getEmpCode(companyId: any): Observable<APIResponse>

}