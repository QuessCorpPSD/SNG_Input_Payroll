import { Injectable } from '@angular/core';
import { IVendoremployeeService } from '../../Repository/Master/ivendoremployee.service';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ILeaveOpeningBalance } from '../../Repository/Master/ileaveopeningbalance.service';

@Injectable({
  providedIn: 'root'
})
export class LeaveOpeningBalanceService implements ILeaveOpeningBalance{
    environment = environment;
  
  constructor(private http: HttpClient) {
  }


  GetLeaveOpeningCompanywise(CompanyId: string,SiteName:string): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'LeaveOpeningBalance/GetLeaveOpeingBalance/' + CompanyId + '/' + SiteName);
    }

  PostLeaveOpeningTemplate(LeaveOpeningBalance: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}LeaveOpeningBalance/GetLeaveOpeingBalanceTemplate/`;
    return this.http.post<APIResponse>(url, LeaveOpeningBalance);
  }
    UploadLeaveOpeningBalance(formData: FormData): Observable<APIResponse> {
return this
    .http.post<APIResponse>(
      this.environment.apiUrl + 'LeaveOpeningBalance/ImportLeaveOpeingBalance/',
      formData 
    );  }  
}
