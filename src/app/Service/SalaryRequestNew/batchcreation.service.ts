import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IBatchreation } from '../../Repository/SalaryRequestNew/Ibatchcreation';

@Injectable({
  providedIn: 'root'
})
export class BatchcreationService implements IBatchreation {
  env = environment

  constructor(private http: HttpClient) { }

  Entitylist(userid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BatchGeneration/EntityListbg/' + userid);
  }
  Batchtype(userid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/GetCommonDropDownList/BatchTypeList/' + userid);
  }
  Batchcreationtype(userid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BatchGeneration/BatchCreationTypelist/' + userid);
  }

  Search(batchtype: any, batchcreate: any, entity: any, userid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.env.apiUrl}BatchGeneration/GetApproveInvoices/${batchtype}/${batchcreate}/${entity}/${userid}`
    );
  }

  Export(batchtype: any, batchcreate: any, entity: any, userid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.env.apiUrl}BatchGeneration/GetApproveInvoicesExport/${batchtype}/${batchcreate}/${entity}/${userid}`
    );
  }

}
