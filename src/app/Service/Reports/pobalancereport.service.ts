import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IPobalancereport } from '../../Repository/Reports/IPobalance.service';

@Injectable({
  providedIn: 'root'
})
export class PobalancereportService implements IPobalancereport {

  env = environment;
  constructor(private http: HttpClient) { }

  Exporttoexcel(selectedCompanyId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}POBalanceReport/ExportToExcel/${selectedCompanyId}`
    );
  }
}
