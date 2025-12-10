import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IBillingUbr {
    GetPayPeriod(): Observable<APIResponse>;
    Exporttoexcel(payPeriodId: any): Observable<APIResponse>;

}