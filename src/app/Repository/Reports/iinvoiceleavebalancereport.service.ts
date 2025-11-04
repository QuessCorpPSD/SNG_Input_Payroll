import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IInvoiceLeaveBalanceReport {
    GetLeaveYear(): Observable<APIResponse>;
    GetAllInvoiceLeaveBalanceReport(companyId: string, siteId: string, frommonth: string, fromyear:string, tomonth:string,toyear:string): Observable<APIResponse>;


}