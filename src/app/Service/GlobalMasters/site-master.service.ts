import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IsiteMaster } from '../../Repository/GlobalMasters/IsiteMaster';

@Injectable({
  providedIn: 'root'
})
export class SiteMasterService implements IsiteMaster {
  env = environment
  constructor(private http: HttpClient) {
  }

  SiteSearch(companyId: any, groupId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'SiteMaster/Search?companyId=' + companyId + '&groupId=' + groupId);
  }
  SiteExportExcel(companyId: any, groupId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'SiteMaster/ExporttoExcel?companyId=' + companyId + '&groupId=' + groupId);
  }
  GetPortalPayslipFormat(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'SiteMaster/GetPortalPayslipFormat',
    );
  }
  CreateSiteMaster(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'SiteMaster/CreateUpdateSiteMaster',
      payload
    );
  }

  UploadSiteMaster(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'SiteMaster/UploadSiteMaster',
      payload
    );
  }

}