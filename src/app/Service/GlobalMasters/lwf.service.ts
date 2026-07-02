import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { ILwf } from '../../Repository/GlobalMasters/Ilwf';

@Injectable({
  providedIn: 'root'
})
export class LwfService implements ILwf {
  env = environment

  constructor(private http: HttpClient) { }

  GetState(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ESI/GetStates')
  }

  Search(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'LWF/GetLWFSlabSearch', payload)
  }
  Exporttoexcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'LWF/GetLWFSlabExporttoExcel', payload)
  }
  GetMonth(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ESI/GetMonths')
  }
  CreateupdateDelete(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'LWF/CreateUpdateDeleteLWFSlab', payload)
  }
}
