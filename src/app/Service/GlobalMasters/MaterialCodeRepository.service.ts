import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { HttpClient } from '@angular/common/http';
import { IMaterialCodeRepository } from '../../Repository/GlobalMasters/IMaterialCodeRepository';

@Injectable({
  providedIn: 'root'
})
export class MaterialCodeService implements IMaterialCodeRepository {
  env = environment

  constructor(private http: HttpClient) { }

  Search(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'MaterialCode/Search')
  }

  Create(MaterialCodeMasterRequest: any): Observable<APIResponse> {
    const url=this.env.apiUrl + 'MaterialCode/Create';
    return this.http.post<APIResponse>(url, MaterialCodeMasterRequest)
  }
}