import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { ICreditNoteRepository } from '../../Repository/invoice/IcreditnoteRepository';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreditNoteRequestServiceService {
  environment = environment;

  constructor(private http: HttpClient) { }
  GetCreditNoteSearch(
    purpose: string,
    companyId: any,
    payPeriodId: any,
    action: string,
    refId: string
  ): Observable<APIResponse> {

    return this.http.get<APIResponse>(
      `${this.environment.apiUrl}CreditNoteRequest/Search/${purpose}/${companyId}/${payPeriodId}/${action}/${refId}`
    );
  }
  GetCreditNoteDropdown(description: string, flag: string): Observable<any> {
    return this.http.get<any>(
      this.environment.apiUrl +
      'CreditNoteRequest/GetDropdown/' + description + '/' + flag
    );
  }


  GetCreditNoteExport(purpose: string, companyId: any, payPeriodId: any): Observable<APIResponse> {

    const action = 'EXPORT';   // ⚠️ required by backend
    const refId = '';          // optional

    return this.http.get<APIResponse>(
      this.environment.apiUrl +
      'CreditNoteRequest/Export/' +
      purpose + '/' +
      companyId + '/' +
      payPeriodId + '/' +
      action + '/' +
      refId
    );
  }


  ImportCreditNote(formData: FormData): Observable<any> {
    return this.http.post(
      this.environment.apiUrl + 'CreditNoteRequest/UploadCreditNote',
      formData
    );
  }


  SaveUpdateDeleteCreditNote(payload: any): Observable<any> {
    return this.http.post(
      this.environment.apiUrl + 'CreditNoteRequest/SaveUpdateDeleteCreditNote',
      payload
    );
  }
  DownloadCreditNoteTemplate(Flag: any, Qzoneusername: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'SalaryRequestInvoice/SalaryReleaseTemplate/' + Flag + '/' + Qzoneusername);
  }




}
