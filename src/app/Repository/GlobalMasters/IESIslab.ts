import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IESIslab {

    SearchESI(payload: any): Observable<APIResponse>;
    Exporttoexcel(payload: any): Observable<APIResponse>
    GetPayCodes(): Observable<APIResponse>;
    GetCriteriaType(): Observable<APIResponse>;
    CreateUpdateDeleteEsiSlab(payload: any): Observable<APIResponse>;
    EsiBlockSearch(effectiveDate: string): Observable<APIResponse>;
    ExporttoExcel(effectiveDate: string): Observable<APIResponse>;
    GetBlocks(): Observable<APIResponse>;
    GetMonths(): Observable<APIResponse>;
    CreateUpdateDeleteEsiblock(payload: any): Observable<APIResponse>;
    searchEsiLocationSlab(payload: any): Observable<APIResponse>;
    exportEsiLocationToExcel(payload: any): Observable<APIResponse>;
    GetStates(): Observable<APIResponse>;
    GetCity(stateId: number);
    CreateUpdateDeleteEsiLocationSlab(payload: any): Observable<APIResponse>;


}