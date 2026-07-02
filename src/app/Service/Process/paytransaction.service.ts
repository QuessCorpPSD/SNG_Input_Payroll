import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { IPayTransactionService } from '../../Repository/Process/Ipaytransaction.service';

@Injectable({
  providedIn: 'root'
})
export class PaytransactionService implements IPayTransactionService {
  env = environment

  constructor(private http: HttpClient) { }

  SearchPayTransaction(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'PayTransaction/SearchDetails', payload)
  }

  exportPayTransaction(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'PayTransaction/Exporttoexcel', payload)
  }

  importPayTransaction(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'PayTransaction/ImportPayTransaction', payload)
  }

  GetEmployeeCode(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'PayTransaction/GetEmployeeDetailsByCompanyID', payload)
  }

  GetPayCode(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'PayTransaction/GetEmployeeDetailsByCompanyID', payload)
  }
  DeletePayTransaction(Pay_Transaction_Id: any, user_Id: any,): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ITAdjustment/DeletePayTransaction' + '/' + Pay_Transaction_Id + '/' + user_Id)
  }
}
