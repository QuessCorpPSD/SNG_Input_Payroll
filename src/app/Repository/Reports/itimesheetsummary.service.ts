import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface ITimesheetSummary {
        GetLeaveYear(): Observable<APIResponse>;
        GetLocation(companyId: any, siteId: any): Observable<APIResponse>;
        GetAllTimesheetSummaryReport(companyId: any, siteId: any, Location: string, payPeriodId: string, status: string): Observable<APIResponse> ;

}