import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IPayTransactionService {
    SearchPayTransaction(payload: any): Observable<APIResponse>;
    exportPayTransaction(payload: any): Observable<APIResponse>;
    importPayTransaction(payload: any): Observable<APIResponse>;
    GetEmployeeCode(payload: any): Observable<APIResponse>;
    GetPayCode(payload: any): Observable<APIResponse>;
}