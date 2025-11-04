import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IIqitsBillingReport {
    GetLeaveYear(): Observable<APIResponse>;
    GetAllBillingReport(companyId: string, siteId: string, payPeriodId: string): Observable<APIResponse>;


}