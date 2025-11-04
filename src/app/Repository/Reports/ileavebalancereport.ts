import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface ILeaveBalanceReport{
    GetAllLeaveBalanceReport(companyId: string, siteId: string, payPeriodId: string): Observable<APIResponse>;
    GetLeaveYear(): Observable<APIResponse>;
}