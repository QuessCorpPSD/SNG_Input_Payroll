import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../Models/apiresponse';
import { Observable } from 'rxjs';
import { IpayregisterunprocessedService } from '../Repository/ipayregisterunprocessed.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  // ✅ makes the service available app-wide
})
export class PayregisterunprocessedService implements IpayregisterunprocessedService {
  environment = environment;
  constructor(private http: HttpClient) {
  }

    GetExporttoExcel(CompanyId: string, PayperiodId: string): Observable<APIResponse> {
      return this.http.get<APIResponse>(this.environment.apiUrl + 'PayregisterUnprocessed/Exporttoexcel/' + CompanyId + '/' + PayperiodId);
    }
 
}
