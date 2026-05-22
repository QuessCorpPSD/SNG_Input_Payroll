import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface ISgPayRegisterService {
    GetPayPeriod(): Observable<APIResponse>;
    downloadReport(payload: any): Observable<APIResponse>;
}