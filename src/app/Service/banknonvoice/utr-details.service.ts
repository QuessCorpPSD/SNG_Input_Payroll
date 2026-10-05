import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IutrDetails } from '../../Repository/banknonvoice/IutrDetails';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class UtrDetailsService implements IutrDetails {
  environment = environment;

  constructor(private http: HttpClient) { }

  DownloadUtrDetails(companyId: any, payPeriodId: any, EntityId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.environment.apiUrl}UtrDetails/NetPaysummaryNI/${companyId}/${payPeriodId}/${EntityId}`
    );
  }

  EntitySearch(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'Entity/Search');
  }
}
