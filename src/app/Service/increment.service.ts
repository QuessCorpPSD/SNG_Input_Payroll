import { Injectable } from '@angular/core';
import { IIncrementService } from '../Repository/iincrement.service';
import { Observable } from 'rxjs';
import { APIResponse } from '../Models/apiresponse';
import { environment } from "../../environments/environment.development";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IncrementService implements IIncrementService {

  environment = environment;
  constructor(private http: HttpClient) {
  }
  GetEmployeeIncrement(companyId: string, InputType: string, MapNameId: string): Observable<APIResponse> {
    //console.log(this.environment.apiUrl + 'Increment/GetEmployeeIncrement/' + companyId + '/' + InputType + '/' + MapNameId);
    return this.http.get<APIResponse>(this.environment.apiUrl + 'Increment/GetEmployeeIncrement/' + companyId + '/' + InputType + '/' + MapNameId);
  }

  UploadIncrementData(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.environment.apiUrl + 'Increment/UploadIncrementData',
      formData // send as FormData directly
    );
  }
}
