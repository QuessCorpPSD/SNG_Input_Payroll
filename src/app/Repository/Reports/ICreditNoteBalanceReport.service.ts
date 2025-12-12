import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface ICreditNoteBalanceReport {
    Exporttoexcel(payload: any): Observable<APIResponse>

}