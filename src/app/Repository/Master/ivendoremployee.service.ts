import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';


export interface IVendoremployeeService {

  GetVendorEmployeeCompanywise(CompanyId: string, SiteId: string, EmployeeCode: string,EActive: string): Observable<APIResponse>;
  GetVendorEmployeeTemplate(): Observable<APIResponse>;
  UploadVendorEmployee(formData:FormData): Observable<APIResponse>;
  
}