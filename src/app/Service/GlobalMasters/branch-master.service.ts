import { Injectable } from '@angular/core';
import { IBranchmaster } from '../../Repository/GlobalMasters/IbranchMaster';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class BranchMasterService implements IBranchmaster {


  env = environment
  constructor(private http: HttpClient) { }

  SearchBranchMaster(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'BranchMaster/Search', payload)
  }
  Exporttoexcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.env.apiUrl}ESI/GetEsiSlabExporttoExcel`, payload
    );
  }
  GetPTstates(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BranchMaster/GetAllPtState')
  }
}
