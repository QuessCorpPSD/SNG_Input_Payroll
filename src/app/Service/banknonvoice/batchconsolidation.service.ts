import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { IBatchConsolidationReport } from '../../Repository/banknonvoice/IBatchConsolidationReport.service';

@Injectable({
  providedIn: 'root'
})
export class BatchconsolidationService implements IBatchConsolidationReport {
  env = environment
  constructor(private http: HttpClient) { }

  GetEntity(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BatchConsolidationReport/GetNoninvoiveEntity')
  }
  ExportToExcel(
    AllEntityId: any,
    FromDate: any,
    ToDate: any,
    txtsearch: any,
    Reporttype: any
  ): Observable<APIResponse> {

    const search = txtsearch || "all";

    return this.http.get<APIResponse>(
      `${this.env.apiUrl}BatchConsolidationReport/ExportToExcel/${AllEntityId}/${FromDate}/${ToDate}/${search}/${Reporttype}`
    );
  }
}
