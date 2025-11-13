import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShgserviceService {

  env = environment

  constructor(private http: HttpClient) { }

  SearchShg(date: Date): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'SHG/Search/' + date)
  }

  getCategory(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + "SHG/GetCategory")
  }

  createShg(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + "SHG/Create", payload)
  }

}
