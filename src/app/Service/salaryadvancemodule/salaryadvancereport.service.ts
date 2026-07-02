import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { ISalaryadvancereport } from '../../Repository/salaryadvancemodule/Isalaryadvancereport.service';

@Injectable({
  providedIn: 'root'
})
export class SalaryadvancereportService implements ISalaryadvancereport {
  env = environment;
  constructor(private http: HttpClient) { }
    Search(companyId: any, payperiod:any): Observable<APIResponse> {
      return this.http.get<APIResponse>(this.env.apiUrl + 'Report/Search/' + companyId + '/' + payperiod);
    }
}
