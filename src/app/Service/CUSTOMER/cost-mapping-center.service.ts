import { Injectable } from '@angular/core';
import { ICostMappingCenter } from '../../Repository/customer/IcostMappingCenter';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class CostMappingCenterService implements ICostMappingCenter {
  env = environment
  constructor(private http: HttpClient) {
  }
  GetAllCostDetails(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'CostCenterMapping/GetAllCostCentertDetails/'
    );
  }

  // SaveCostCenterMapping(payload: any): Observable<APIResponse> {
  //   return this.http.post<APIResponse>(
  //     environment.apiUrl + 'CostCenterMapping/SaveUpdateDeleteCostCenter',
  //     payload
  //   );
  // }
  ExportCostCenterMapping(payload: any): Observable<any> {
    return this.http.post<APIResponse>(
      environment.apiUrl + 'CostCenterMapping/CostCenterExport',
      payload
    );
  }
  UploadCostCenterMapping(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'CostCenterMapping/PostCostCenterUpload',
        formData
      );
  }
  SaveCostCenterDetails(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      environment.apiUrl + 'CostCenterMapping/SaveUpdateDeleteCostCenter?',
      payload
    );
  }

}


