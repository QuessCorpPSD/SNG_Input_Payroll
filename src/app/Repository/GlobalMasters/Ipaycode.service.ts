import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IPAycodeService {
    GetPayType(): Observable<APIResponse>;
    SearchPayCode(payload: any): Observable<APIResponse>;
    CreatePayCode(payload: any): Observable<APIResponse>;
    GetPageType(): Observable<APIResponse>;

}