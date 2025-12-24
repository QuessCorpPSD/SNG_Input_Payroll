import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface ICityRepository {
    Search(cityName: string, stateId: number, cityId: number): Observable<APIResponse>;
    GetCircle(stateId: number): Observable<APIResponse>;
    PostAddCity(CityAddRequest: any): Observable<APIResponse>;
}