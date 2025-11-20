import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IOneTimeReplacement {
    Allowsearch(payload: any): Observable<APIResponse>;
    downloadExcel(payload: any): Observable<APIResponse>;
    AllowReprocess(payload: any): Observable<APIResponse>;
}