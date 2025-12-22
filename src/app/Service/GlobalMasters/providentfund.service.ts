import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IPFService } from '../../Repository/GlobalMasters/IPF.service';

@Injectable({
  providedIn: 'root'
})
export class ProvidentfundService implements IPFService {

  env = environment
  constructor(private http: HttpClient) { }

  getCap(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'PF/PFCapType')
  }

  Search(CapType: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'PF/PFSearch/' + CapType)
  }

  exportToExcel(CapType: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'PF/PFExporttoExcel/' + CapType)
  }

  getPayCode(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'PF/PFPayCodes')
  }

  addPf(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'PF/CreateUpdatePF', payload)
  }

  deletePf(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'PF/DeletePF', payload)
  }

  getCriteriaType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ESI/GetCriteriaType')
  }

}
