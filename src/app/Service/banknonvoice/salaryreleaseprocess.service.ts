import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { ISalaryReleaseProcess } from '../../Repository/banknonvoice/ISalaryReleaseProcess';


@Injectable({
  providedIn: 'root'
})
export class SalaryreleaseprocessService implements ISalaryReleaseProcess {

  env = environment;

  constructor(private http: HttpClient) { }

  SearchDetails(batchId: string): Observable<APIResponse> {

    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'SalaryReleaseProcess/SearchDetails/' +
      batchId
    );
  }

  GetSRPBatchList(BatchType:any,UserId:any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'NIBatchGeneration/GetSRPBatchList/' +
      BatchType +'/'+UserId
    );
  }

  GetSRPBatchData(BatchType:any,BatchId:any,UserId:any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'NIBatchGeneration/GetSRPBatchData/'+BatchType +'/'+BatchId+'/'+UserId
    );
  }


  SalaryReleaseExport(
    payload: any
  ): Observable<APIResponse> {

    return this.http.post<APIResponse>(
      this.env.apiUrl +
      'NIBatchGeneration/SalaryReleaseExport',
      payload
    );
  }

  BatchIntitiate(payload: any): Observable<any> {
    return this.http.post(
      this.env.apiUrl +
      'NIBatchGeneration/BatchIntitiate',
      payload,
      {
        observe: 'response',
        responseType: 'blob'
      }
    );
  }

  GetBatchTypeList(userid): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'NIBatchGeneration/GetBatchTypeList/' + userid
    );
  }
}