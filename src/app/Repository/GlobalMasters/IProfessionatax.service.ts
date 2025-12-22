import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IProfessionatax {
    GetPTType(): Observable<APIResponse>;
    GetState(): Observable<APIResponse>;
    Search(payload: any): Observable<APIResponse>;
    exportToExcel(payload: any): Observable<APIResponse>;
    getCategory(): Observable<APIResponse>;
    getCircle(stateId: any): Observable<APIResponse>;
    getMonth(): Observable<APIResponse>;
    addPt(payload: any): Observable<APIResponse>;

}