import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IDynamicRemove {
    getPageName(): Observable<APIResponse>;
    import(payload: any): Observable<APIResponse>
}