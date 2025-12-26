import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IStateRepository {
    SearchCity(stateName: string, regionId?: number, stateId?: number): Observable<APIResponse>
    GetRegion(): Observable<APIResponse>;
    PostAddState(CityAddRequest: any): Observable<APIResponse>;
}