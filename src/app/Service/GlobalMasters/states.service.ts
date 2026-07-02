import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { IStateRepository } from '../../Repository/GlobalMasters/IState.service';

@Injectable({
  providedIn: 'root'
})
export class StatesService implements IStateRepository {
  env = environment
  constructor(private http: HttpClient) {
  }

  SearchCity(stateName: string, regionId?: number, stateId?: number): Observable<APIResponse> {
    let params = new HttpParams();
    if (stateName) params = params.set('stateName', stateName);
    if (regionId != null) params = params.set('regionId', regionId.toString());
    if (stateId != null) params = params.set('stateId', stateId.toString());

    return this.http.get<APIResponse>(`${this.env.apiUrl}State/GetAllState`, { params });
  }



  GetRegion(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'State/GetAllRegion');
  }

  PostAddState(CityAddRequest: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'State/AddState', CityAddRequest);
  }
}
