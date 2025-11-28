import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface ISDLslabDetail {
    SDLSearch(): Observable<APIResponse>;
    GetCriteriaType(): Observable<APIResponse>
    GetPayCodeList(): Observable<APIResponse> ;
    CreateSDL(payload: any): Observable<APIResponse>;
}