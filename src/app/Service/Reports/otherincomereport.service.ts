import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { IOtherIncomeReport } from '../../Repository/Reports/IOtherIncomeReport.service';

@Injectable({
  providedIn: 'root'
})
export class OtherincomereportService implements IOtherIncomeReport {

  env = environment

  constructor(private http: HttpClient) { }

  Exporttoexcel(CompanyId: any, paySequenceNo: any, payCodeId: any, inputNo: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.env.apiUrl}OtherIncomeReport/ExportToExcel/${CompanyId}/${paySequenceNo}/${payCodeId}/${inputNo}`
    );
  }

  getInputNo(CompanyId: any, payPeriodId: any) {
    return this.http.get<APIResponse>(
      `${this.env.apiUrl}OtherIncomeReport/GetInputno/${CompanyId}/${payPeriodId}`
    );
  }


}
