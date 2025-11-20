import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface ILockPayPeriodService {
    SearchLockPayPeriod(payload: any): Observable<APIResponse>;
    exportLockPayPeriod(payload: any): Observable<APIResponse>;
    importLockPayPeriod(payload: any): Observable<APIResponse>;
    Getmonth(): Observable<APIResponse>;
    addLockPayPeriod(payload: any): Observable<APIResponse>;
}