import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'process';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IFormulaRepository } from '../../Repository/GlobalMasters/IFormulaRepository';


@Injectable({
  providedIn: 'root'
})
export class FormualService implements IFormulaRepository {
  env = environment
  constructor(private http: HttpClient) {
  }
  GetFormulaSearch(paycode_Id: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Formula/Search/' + paycode_Id,
    );
  }

  payCategory(selectedCompanyId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Formula/GetPayCategory/' + selectedCompanyId,
    );
  }
  payCode(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Common/GetPaycodes',
    );
  }
  CreateFormula(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Formula/Create',
      payload
    );
  }
  PaycodeSearch(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Paycode/Search', payload,
    );
  }

  MultiCommercialPaycodes(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Common/GetMultiCommercialPaycodes',
    );
  }

  CreateMCFormula(payload: any): Observable<APIResponse> {
    console.log('Payload', payload);
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Formula/CreateMC',
      payload
    );
  }

  PayrollType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Formula/GetPayrollType/',
    );
  }

  GetMCFormulaSearch(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Formula/MCSearch',
    );
  }

}