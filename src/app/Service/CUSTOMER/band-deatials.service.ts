import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { APIResponse } from '../../Models/apiresponse';
import { IBanddetails } from '../../Repository/customer/banddetails';

@Injectable({
  providedIn: 'root'
})
export class BandDeatialsService implements IBanddetails {
  env = environment
  constructor(private http: HttpClient) {
  }
  GetAllBandDetails(companyId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Band/GetAllBandDetails/' + companyId
    );
  }
  SaveBandDetails(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      environment.apiUrl + 'Band/SaveUpdateDeleteBand?',
      payload
    );
  }


}
