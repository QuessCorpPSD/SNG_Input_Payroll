import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment.development';
import { IutrDetails } from '../../Repository/BankNonInvoice/IutrDetails';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class UtrDetailsService implements IutrDetails {
  environment = environment;

  constructor(private http: HttpClient) { }

  DownloadUtrDetails(companyId: any, payPeriodId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.environment.apiUrl}UtrDetails/GetUtrDetails/${companyId}/${payPeriodId}`
    );
  }
}
