import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface ICPFslabDetails {
    GetPayCodeList(): Observable<APIResponse>;
    CDFSearch(payload: any): Observable<APIResponse>;
    GetCategory(): Observable<APIResponse>;
    GetCriteriaType(): Observable<APIResponse>
    CreateCPF(payload: any): Observable<APIResponse>;
}