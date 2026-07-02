import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'process';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { ISDLslabDetail } from '../../Repository/GlobalMasters/ISDLslabDetail';

@Injectable({
  providedIn: 'root'
})
export class SDLslabDetailsService implements ISDLslabDetail {
  env = environment
  constructor(private http: HttpClient) {
  }
  SDLSearch(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'SDL/Search',
    );
  }
  GetPayCodeList(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'SDL/GetPaycode',
    );
  }
  GetCriteriaType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}CPF/GetCriteria`);
  }
  CreateSDL(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'SDL/Create',
      payload
    );
  }

}

