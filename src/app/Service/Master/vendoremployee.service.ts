import { Injectable } from '@angular/core';
import { IVendoremployeeService } from '../../Repository/Master/ivendoremployee.service';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { environment } from '../../../Environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VendoremployeeService implements IVendoremployeeService{
    environment = environment;
  
  constructor(private http: HttpClient) {
  }
  GetVendorEmployeeCompanywise(CompanyId: string, SiteId: string, EmployeeCode: string, EActive: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'VendorEmployee/GetVendorEmployee/' + CompanyId + '/' + SiteId + '/' + EmployeeCode + '/' + EActive);
  }
  GetVendorEmployeeTemplate(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'VendorEmployee/GetVendorEmployeeTemplate');
  }
  UploadVendorEmployee(formData: FormData): Observable<APIResponse> {
  return this
    .http.post<APIResponse>(
      this.environment.apiUrl + 'VendorEmployee/ImportVendorEmployee',
      formData 
    );  }
}
