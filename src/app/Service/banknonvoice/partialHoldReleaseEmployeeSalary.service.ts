

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { HttpClient } from '@angular/common/http';
import { IpartialHoldReleaseEmployeeSalary } from '../../Repository/banknonvoice/IpartialHoldReleaseEmployeeSalary';

@Injectable({
  providedIn: 'root'
})
export class partialHoldReleaseEmployeeSalaryService implements IpartialHoldReleaseEmployeeSalary {

  env = environment;

  constructor(private http: HttpClient) { }
  
  GetTemplate(userid: any, Flag: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'NIBatchGeneration/GetTemplate/' + Flag + '/' + userid
    );
  }


   UploadReleaseHoldSalary(formData: FormData,flag:any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'PartialHoldRelease/'+flag,
      formData
    );
  }

}