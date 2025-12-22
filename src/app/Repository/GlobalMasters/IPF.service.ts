import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IPFService {
    getCap(): Observable<APIResponse>;
    Search(CapType: any): Observable<APIResponse>;
    exportToExcel(CapType: any): Observable<APIResponse>;
    getPayCode(): Observable<APIResponse>;
    addPf(payload: any): Observable<APIResponse>;
    deletePf(payload: any): Observable<APIResponse>;
    getCriteriaType(): Observable<APIResponse>;
}