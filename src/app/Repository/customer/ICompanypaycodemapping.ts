import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface ICompanypaycodemapping {
    PostAddPaycodeMapping(payloadCreate: any): Observable<APIResponse>;
    Exporttoexcel(companyid: any): Observable<APIResponse>;
    Pickfrom(): Observable<APIResponse>;
    companypaycodesearch(companyid: any): Observable<APIResponse>;
    paycodeSearch(payload: any): Observable<APIResponse>;
}