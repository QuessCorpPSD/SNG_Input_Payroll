import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { IClientaddress } from '../../Repository/customer/IClientaddress';

@Injectable({
  providedIn: 'root'
})
export class ClientaddressService implements IClientaddress {

  env = environment;
  httpClient: any;
  constructor(private http: HttpClient) {

  }

  Search(payload: any): Observable<APIResponse> {
    const params = new HttpParams({ fromObject: payload });

    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ClientAddress/GetAllClientAddressDetails/' + payload
    );
  }

  ExporttoExcel(userid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ClientAddress/ClientAddressExport/' + userid
    );
  }

  clientaddressaddsave(payload: any): Observable<string> {
    return this.http.post(
      this.env.apiUrl + 'ClientAddress/PostAddClientAddress',
      payload,
      { responseType: 'text' }
    );
  }


  getcostcenter(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'CostCenterMapping/GetAllCostCentertDetails'
    );
  }

  PostClientAddressUpload(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'ClientAddress/PostClientAddressUpload', payload)
  }
  PostClientAddressDelete(clientaddressid: any, userid: any): Observable<string> {
    return this.http.get<string>(
      this.env.apiUrl + 'ClientAddress/PostDeleteClientAddress/' + clientaddressid + '/' + userid,
      { responseType: 'text' as 'json' }
    );
  }


}
