import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IotherIncomeProcess {
    GetPayPeriod(): Observable<APIResponse>;
    Exporttoexcel(payPeriodId: any): Observable<APIResponse>;

}