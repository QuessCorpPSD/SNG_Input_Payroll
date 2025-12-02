import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IEntityMaster } from '../../Repository/GlobalMasters/IEntityMaster';

@Injectable({
  providedIn: 'root'
})
export class EntityMasterService implements IEntityMaster {
  env = environment
  constructor(private http: HttpClient) {
  }
  EntitySearch(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Entity/Search',
    );
  }
  GetQuessLegalEntity(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Entity/GetQuessLegalEntity',
    );
  }
  CreateEntity(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Entity/Create',
      payload
    );
  }

}
