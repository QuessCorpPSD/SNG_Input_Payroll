import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { HttpClient } from '@angular/common/http';
import { IPAycodeService } from '../../Repository/GlobalMasters/Ipaycode.service';

@Injectable({
  providedIn: 'root'
})
export class PaycodeserviceService implements IPAycodeService {
  env = environment

  constructor(private http: HttpClient) { }
  GetPayType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Paycode/GetPayType')
  }

  SearchPayCode(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'Paycode/Search', payload)
  }

  CreatePayCode(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'Paycode/Create', payload)
  }

  GetPageType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Paycode/GetPageType')
  }
}
