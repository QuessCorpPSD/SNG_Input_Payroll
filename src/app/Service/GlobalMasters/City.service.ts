import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'process';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { ICityRepository } from '../../Repository/GlobalMasters/ICity.service';



@Injectable({
    providedIn: 'root'
})
export class CityService implements ICityRepository {
    env = environment
    constructor(private http: HttpClient) {
    }
    Search(cityName: string, stateId?: number, cityId?: number): Observable<APIResponse> {
        return this.http.get<APIResponse>(
            `${this.env.apiUrl}City/GetAllCity`,
            {
                params: {
                    cityName: cityName || '',
                    stateId: stateId?.toString() ?? '',
                    cityId: cityId?.toString() ?? ''
                }
            }
        );
    }

    GetCircle(stateId: number): Observable<APIResponse> {
        return this.http.get<APIResponse>(
            this.env.apiUrl + 'City/GetAllCircle/' + stateId);
    }

    PostAddCity(CityAddRequest: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'City/AddCity', CityAddRequest);
    }
}
