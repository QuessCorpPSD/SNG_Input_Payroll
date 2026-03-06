import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'process';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { environment } from '../../../environments/environment.development';
import { IBankInvoiceNEFTCulture } from '../../Repository/SalaryRequestNew/IBankInvoiceNEFTCulture';

@Injectable({
  providedIn: 'root'
})
export class BankInvoiceNEFTCultureService implements IBankInvoiceNEFTCulture {
  env = environment
  constructor(private http: HttpClient) { }

  NeftCulturesearch(Company_Id: any, UserId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BankNeftCultureInvoice/NeftCulturesearch/' + Company_Id + '/' + UserId);
  }
  NeftCultureExport(Company_Id: any, UserId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BankNeftCultureInvoice/NeftCultureExport/' + Company_Id + '/' + UserId);
  }
  NeftCultureSave(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'BankNeftCultureInvoice/NeftCultureSave',
      payload
    );
  }
  GetDetails(Company_Id: any, Mode: any, UserId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BankNeftCultureInvoice/GetNeftBankculture/' + Company_Id + '/' + Mode + '/' + UserId);
  }

}
