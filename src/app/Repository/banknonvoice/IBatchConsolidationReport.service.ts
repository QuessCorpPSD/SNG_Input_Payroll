import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IBatchConsolidationReport {
    GetEntity(): Observable<APIResponse>;
    ExportToExcel(AllEntityId: any, FromDate: any, ToDate: any, txtsearch: any, Reporttype: any): Observable<APIResponse>;
}