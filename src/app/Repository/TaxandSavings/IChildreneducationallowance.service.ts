import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IChildreneducationallowance {
    GetFinancialyear(): Observable<APIResponse>;
    GetEmployee(comapnyid: any, financialyearid: any): Observable<APIResponse>;
    Search(comapnyid: any, financialyearid: any, employeeid: any): Observable<APIResponse>;
    GetEligibleemployee(financialYearId: any, employeeId: any): Observable<APIResponse>;
    GetEligibleChildren(Effective_Date: any, Number_Of_Children: any): Observable<APIResponse>;
    save(payload: any): Observable<APIResponse>;
}