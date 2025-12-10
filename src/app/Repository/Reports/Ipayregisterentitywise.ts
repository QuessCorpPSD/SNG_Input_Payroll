import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IpayregisterentitywiseService {
    EntitySearch(): Observable<APIResponse>;
    GetPayPeriod(): Observable<APIResponse>;
    Exporttoexcel(entityid: any, payPeriodId: any): Observable<APIResponse>;

}