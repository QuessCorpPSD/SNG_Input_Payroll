import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";


export interface IPayProcessRepository  {
    GetITCalenderCompany(val):Observable<APIResponse>;
    GetDate(val):Observable<APIResponse>;
    PayProcess(payload: any): Observable<APIResponse>;
    FandFPayProcess(payload: any): Observable<APIResponse>;
}