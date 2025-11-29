import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { ICorporatebabk } from '../../Repository/customer/Icorporatebank';

@Injectable({
  providedIn: 'root'
})
export class CorporateBankService implements ICorporatebabk {
  env = environment
  constructor(private http: HttpClient) {
  } 
  Search(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'CorporateBank/Search')
  }
   Create(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'CorporateBank/Create',
        formData
      );
  }
}