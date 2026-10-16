import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDynamicRemove } from '../../Repository/Reports/IDynamicRemove';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})

export class DynamicRemoveService implements IDynamicRemove {
  env = environment;
  constructor(private http: HttpClient) { }

  getPageName(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'DynamicRemove/getdynamicdropdown');
  }

  import(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'DynamicRemove/DeleteOptionBulkUpload', payload)
  }
}
