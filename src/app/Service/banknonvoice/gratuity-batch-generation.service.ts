import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { IGratuityBatchGeneration } from '../../Repository/banknonvoice/IGratuityBatchGeneration';


@Injectable({
  providedIn: 'root'
})
export class GratuityBatchGenerationService
  implements IGratuityBatchGeneration {

  env = environment;

  constructor(private http: HttpClient) { }

  Search(fromDate: any, toDate: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'GratuityBatchGeneration/Search/' +
      fromDate + '/' + toDate
    );
  }

  Generate(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl +
      'GratuityBatchGeneration/Generate',
      payload
    );
  }

  ExportToExcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl +
      'GratuityBatchGeneration/ExportToExcel',
      payload
    );
  }

  NonInvoiceGratuityUTRUpload(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl +
      'GratuityBatchGeneration/NonInvoiceGratuityUTRUpload',
      payload
    );
  }

  NonInvoiceGratuityUTRColumnNames(createdBy: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'GratuityBatchGeneration/NonInvoiceGratuityUTRColumnNames/' +
      createdBy
    );
  }
}