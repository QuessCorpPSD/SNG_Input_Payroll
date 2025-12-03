import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../Models/apiresponse';
import { Iinvoiceculture } from '../Repository/IInvoice culture';



@Injectable({
  providedIn: 'root'
})
export class InvoiceCultureService implements Iinvoiceculture {
  env = environment
  constructor(private http: HttpClient) {
  }

  GetStates(companyId: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'InvoiceCulture/GetAllStatebyCompanyId/' + companyId
    );
  }

  ServiceChargeMaster(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'InvoiceCulture/GetAllServiceChargeMaster/'
    );
  }

  CreateNewPO(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'InvoiceCulture/GetAllStatebyCompanyId/'
    );
  }

  postInvoiceCulture(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'InvoiceCulture/Create',
      payload
    );

  }

  InvoiceType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'InvoiceCulture/GetAllInvoiceType'
    );
  }
  InvoiceCategory(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'InvoiceCulture/GetAllInvoiceCategories'
    );
  }
  InvoicecultureSearch(companyId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      environment.apiUrl + `InvoiceCulture/GetAllInvoiceCulture/` + companyId);

  }

  UploadInvoiceCulture(formData: FormData): Observable<APIResponse> {
    const url = `${environment.apiUrl}InvoiceCulture/PostUploadInvoiceCulture`;
    console.log(url);
    return this.http.post<APIResponse>(url, formData);
  }

  ExportToExcel(userId: number) {
    return this.http.get<APIResponse>(
      environment.apiUrl + `InvoiceCulture/InvoiceCultureExport/` + userId);
  }
}


