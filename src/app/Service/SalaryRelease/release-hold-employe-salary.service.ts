import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { IReleaseHoldemployeeSalary } from '../../Repository/SalaryRequest/IReleaseHoldemployeeSalary';

@Injectable({
  providedIn: 'root'
})
export class ReleaseHoldEmployeSalaryService implements IReleaseHoldemployeeSalary {
  env = environment
  constructor(private http: HttpClient) {
  }

  HoldReleaseEmployeSearch(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'SalaryRequestNoninvoice/NIHoldReleasList',
      payload
    );
  }

  HoldReleaseRequest(payload: any): Observable<APIResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    console.log('Sending to API:', this.env.apiUrl + 'SalaryRequestNoninvoice/NIHoldReleaseRequest');

    return this.http.post<APIResponse>(
      this.env.apiUrl + 'SalaryRequestNoninvoice/NIHoldReleaseRequest',
      payload,
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Service Error:', error);
        return throwError(() => error);
      })
    );
  }
  DownloadTemplate(Flag: any, Qzoneusername: any, createdBy: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/SalaryReleaseTemplate/' + Flag + '/' + Qzoneusername + '/' + createdBy);
  }

  UploadRequest(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'SalaryRequestInvoice/UploadSalaryReleaseRequest',
        formData
      );
  }
}