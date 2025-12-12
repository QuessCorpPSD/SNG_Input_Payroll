import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IotherincomeentitywiseService {
    getEntity(): Observable<APIResponse>;
    GetPayPeriod(): Observable<APIResponse>;
    Exporttoexcel(payload: any): Observable<APIResponse>

}