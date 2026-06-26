import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface ICpfsummary {
    // EntitySearch(): Observable<APIResponse>;
    InvoiceSearch(): Observable<APIResponse>;
    GetPayPeriod(): Observable<APIResponse>;
    Exporttoexcel(payload: any): Observable<APIResponse>;
}