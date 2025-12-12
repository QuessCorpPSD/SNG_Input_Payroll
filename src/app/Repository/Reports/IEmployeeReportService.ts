import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IEmployeeReportProcess {
    GetPayPeriod(): Observable<APIResponse>;
    Exporttoexcel(payload: any): Observable<APIResponse>;

}