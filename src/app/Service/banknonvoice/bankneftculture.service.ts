import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { Observable } from 'rxjs';
import { IBankNonInvoiceNEFTCulture } from '../../Repository/banknonvoice/Ibankneftculture';

@Injectable({
  providedIn: 'root'
})
export class BankneftcultureService implements IBankNonInvoiceNEFTCulture {
  env = environment

  constructor(private http: HttpClient) { }

  search(companyid: any, bankcultureid: any, mode: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BankNEFTcultureNonInvoice/GetSearchdata/' + companyid + '/' + bankcultureid + '/' + mode)
  }

  Getbankname(companyid: any, mode: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BankNEFTcultureNonInvoice/Getbankname/' + companyid + '/' + mode)
  }



  Create(payload: any): Observable<APIResponse> {

    return this.http.post<APIResponse>(
      this.env.apiUrl + 'BankNEFTcultureNonInvoice/NeftCultureSave',
      payload
    );
  }

  getpayperiod(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BankNEFTcultureNonInvoice/Getpayperiod')
  }

  exporttoexcel(payperiod: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BankNEFTcultureNonInvoice/exporttoexcel/' + payperiod)
  }

  GetBusinessUnit():Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'InvoiceBatchConsolidation/GetBusinessUnit'
    );
  }

}
