import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { IProfessionatax } from '../../Repository/GlobalMasters/IProfessionatax.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessionaltaxService implements IProfessionatax {

  env = environment
  constructor(private http: HttpClient) { }

  GetPTType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'PT/PTType')
  }

  GetState(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ESI/GetStates')
  }

  Search(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'PT/PTSearch', payload)
  }

  exportToExcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'PT/PTExporttoExcel', payload)
  }

  getCategory(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'PT/PTCategory')
  }

  getCircle(stateId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'PT/PTCircle/' + stateId)
  }

  getMonth(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ESI/GetMonths')
  }

  addPt(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'PT/CreateUpdateDeletePT', payload)
  }

}
