import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IServiceCharge } from '../../Repository/customer/IserviceCharge';

@Injectable({
  providedIn: 'root'
})
export class ServiceChargeService implements IServiceCharge {
  env = environment
  constructor(private http: HttpClient) {
  }
  UploadOneTime(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'ServiceCharge/FileUpload',
        formData
      );
  }
  GetServiceCharge(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ServiceCharge/servicechargemaster')
  }

  GetServiceChargeNew(companyId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ServiceCharge/servicechargemasterNew/' + companyId)
  }
  GetServicechargetype(companyid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ServiceCharge/servicechargetype/' + companyid)
  }

  GetSearch(companyId: number, Service_Charge_Master_Id: number, Service_Charge_Type_Id: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ServiceCharge/GetAllServiceCharge/' + companyId + '/' + Service_Charge_Master_Id + '/' + Service_Charge_Type_Id
    );

  }
  GetCostCenterMapping(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'CostCenterMapping/GetAllCostCentertDetails/1'
    );
  }
  SaveServiceCharge(request: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      environment.apiUrl + 'ServiceCharge/Create',
      request
    );
  }

  SaveSourcingType(request: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      environment.apiUrl + 'ServiceCharge/Create',
      request
    );
  }

  LoadUnitType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      environment.apiUrl + 'ServiceCharge/GetUnitTypeBilltoRate');
  }

  loadEmployee(companyid: any, employeeid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Employee/SearchDetails/' + companyid + '/' + employeeid);
  }

  deleteServiceCharge(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      environment.apiUrl + 'ServiceCharge/ServiceChargeDelete', payload);
  }

  upload(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'ServiceCharge/FileUploadServiceFeeBilltoRate', formData
    );

  }



}