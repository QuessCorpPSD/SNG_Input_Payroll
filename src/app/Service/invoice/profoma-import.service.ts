import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { IProfomaImport } from '../../Repository/invoice/IProfomaImport';

@Injectable({
  providedIn: 'root'
})
export class ProfomaImportService implements IProfomaImport {
  environment = environment;

  constructor(private http: HttpClient) { }

  importProforma(formData: FormData): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}InvoiceInitiationAgainstProfoma/ProfomaImport`;
    return this.http.post<APIResponse>(url, formData);
  }

  search(CompanyId: number, PayperiodId: any, flag: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'InvoiceInitiationAgainstProfoma/GetProfoma/' + CompanyId + '/' + PayperiodId + '/' + flag);
  }


  ProformaInitiate(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.environment.apiUrl + 'InvoiceInitiationAgainstProfoma/Initiate', payload);
  }

}
