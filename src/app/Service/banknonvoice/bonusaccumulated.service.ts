import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { IBonusAccumulatedReport } from '../../Repository/banknonvoice/IBonusAccumulatedReport.service';

@Injectable({
  providedIn: 'root'
})
export class BonusaccumulatedService implements IBonusAccumulatedReport {
  env = environment
  constructor(private http: HttpClient) { }

  // ExportToExcel(Company_Id: any, From_Date: any, To_Date: any,): Observable<APIResponse> {
  //   return this.http.get<APIResponse>(
  //     `${this.env.apiUrl}BatchConsolidationReport/ExportToExcel/${Company_Id}/${From_Date}/${To_Date}`
  //   );
  // }

  ExportToExcel(Company_Id: any, From_Date: any, To_Date: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'BonusAccumatedReport/ExportToExcel/' +
      Company_Id + '/' +
      From_Date + '/' +
      To_Date
    );
  }
}
