import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IVANPayment } from '../../Repository/SalaryRequest/IVANpayment';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class VANPaymentService implements IVANPayment  {
  env = environment
  getAllCompanies: any;
  constructor(private http: HttpClient) {
  }

    GetCompanyCodes(userId: number): Observable<APIResponse> {
    const url = `${this.env.apiUrl}Common/GetAllCompanyCode/${userId}`;
    return this.http.get<APIResponse>(url);

  }
  searchAndDownloadExcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'SalaryRequestInvoice/ViewVanPaymentRequestList',
      payload
    );
  }

  
DownloadTemplate(Flag: any, Qzoneusername: any, createdBy: any): Observable<APIResponse> {
  return this.http.get<APIResponse>(
    this.env.apiUrl + 'SalaryRequestInvoice/SalaryReleaseTemplate/' + Flag + '/' + Qzoneusername + '/' + createdBy
  );
}

UploadVANPayment(formData: FormData): Observable<APIResponse> {
  return this.http.post<APIResponse>(
    this.env.apiUrl + 'SalaryRequestInvoice/VanPaymentRequestUpload',
    formData 
  );
}
}