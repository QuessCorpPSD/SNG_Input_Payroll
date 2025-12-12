import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IincreamentReport {
    GetEmployeesByCompanyId(payload: any): Observable<any>;
    Exporttoexcel(companyId: any, payPeriodId: any, employeeId: any): Observable<APIResponse>;


}