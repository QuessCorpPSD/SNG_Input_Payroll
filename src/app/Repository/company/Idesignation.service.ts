import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IDesignation {
    searchDesignation(companyCode: any): Observable<APIResponse>
    exportDesignation(payload: any): Observable<APIResponse>
    importDesignation(payload: any): Observable<APIResponse>
    saveDesignation(payload: any): Observable<APIResponse>

}