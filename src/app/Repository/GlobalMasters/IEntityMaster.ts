import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IEntityMaster {
    EntitySearch(): Observable<APIResponse>;
    GetQuessLegalEntity(): Observable<APIResponse>;
    CreateEntity(payload: any): Observable<APIResponse>
}