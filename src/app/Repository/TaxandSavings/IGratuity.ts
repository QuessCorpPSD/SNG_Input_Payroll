import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IGratuity {
    GetFinancialyear(): Observable<APIResponse>;
    GetEmployee(comapnyid: any): Observable<APIResponse>;
    Search(comapnyid: any, employeeid: any): Observable<APIResponse>;
    GetPerkCodes(): Observable<APIResponse>;
    GetEligibleChildren(Effective_Date: any, Number_Of_Children: any): Observable<APIResponse>;
    save(payload: any): Observable<APIResponse>;
    GetEmployeeadd(comapnyid: any, financialYearId: any): Observable<APIResponse>;
    GetBasic(employeeid: any): Observable<APIResponse>;
    GetDAamount(employeeid: any): Observable<APIResponse>;
    GetEmployeeBind(employeeid: any): Observable<APIResponse>;
}