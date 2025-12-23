import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IcomputationRule {
    getFinancialYear(): Observable<APIResponse>;
    Search(payload: any): Observable<APIResponse>;
    exportToExcel(payload: any): Observable<APIResponse>;
    addCR(payload: any): Observable<APIResponse>;
}