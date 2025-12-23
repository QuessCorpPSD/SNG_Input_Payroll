import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IESIslab } from '../../Repository/GlobalMasters/IESIslab';

@Injectable({
  providedIn: 'root'
})
export class ESIslabService implements IESIslab {

  env = environment

  constructor(private http: HttpClient) { }

  SearchESI(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'ESI/GetEsiSlabSearch', payload)
  }
  Exporttoexcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.env.apiUrl}ESI/GetEsiSlabExporttoExcel`, payload
    );
  }
  GetPayCodes(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ESI/GetPaycodes')
  }
  GetCriteriaType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ESI/GetCriteriaType')
  }
  CreateUpdateDeleteEsiSlab(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'ESI/CreateUpdateDeleteEsiSlab',
      payload
    );
  }
  EsiBlockSearch(effectiveDate: string): Observable<APIResponse> {
    const params = new HttpParams().set('EffectiveDate', effectiveDate);

    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ESI/GetEsiblockSearch',
      { params }
    );
  }

  ExporttoExcel(effectiveDate: string): Observable<APIResponse> {
    const params = new HttpParams().set('EffectiveDate', effectiveDate);

    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ESI/GetEsiblockExporttoExcel',
      { params }
    );
  }


  GetBlocks(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ESI/GetBlocks')
  }
  GetMonths(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ESI/GetMonths')
  }
  CreateUpdateDeleteEsiblock(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'ESI/CreateUpdateDeleteEsiblock',
      payload
    );
  }

  searchEsiLocationSlab(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'ESI/GetEsiLocationSlabSearch', payload)
  }
  exportEsiLocationToExcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.env.apiUrl}ESI/GetEsiLocationSlabExporttoExcel`, payload
    );
  }
  GetStates(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ESI/GetStates')
  }
  GetCity(stateId: number) {
    return this.http.get<any>(
      this.env.apiUrl + 'ESI/GetCity/' + stateId
    );
  }
  CreateUpdateDeleteEsiLocationSlab(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'ESI/CreateUpdateDeleteEsiLocationSlab',
      payload
    );
  }

}
