import { Injectable } from '@angular/core';
import { IVendorMaster } from '../../Repository/GlobalMasters/IVendorMaster';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class VendorMasterService implements IVendorMaster {
  env = environment
  constructor(private http: HttpClient) {
  }
  VendorSearch(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'VendorMaster/Search',
    );
  }
  CreateVendor(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'VendorMaster/Create',
      payload
    );
  }
}
