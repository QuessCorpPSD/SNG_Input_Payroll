import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IPayPeriodUnlock {
    Search(): Observable<APIResponse>;
    Unlock(payload: any): Observable<APIResponse>;
}