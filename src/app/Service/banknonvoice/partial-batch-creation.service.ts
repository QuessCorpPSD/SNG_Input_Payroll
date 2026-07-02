import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IPartialBatchCreation } from '../../Repository/banknonvoice/IPartialBatchCreation';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class PartialBatchCreationService implements IPartialBatchCreation {
  env = environment;

  constructor(private http: HttpClient) { }


  GetNonInvoiceEntity(): Observable<APIResponse> {

    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'PartialBatchCreation/GetNonInvoiceEntity'
    );
  }
  GetSalaryreleaseProcessdata(companyId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'PartialBatchCreation/GetSalaryreleaseProcessdata/' + companyId
    );
  }

  Batchgenerate(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'PartialBatchCreation/Batchgenerate',
      payload
    );
  }

  ExportToExcel(
    companyId: any
  ): Observable<APIResponse> {

    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'PartialBatchCreation/ExportToExcel/' +
      companyId
    );
  }
}
