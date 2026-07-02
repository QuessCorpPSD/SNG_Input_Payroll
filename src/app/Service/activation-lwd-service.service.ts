import { Injectable } from '@angular/core';
import { IActivationLwdService } from '../Repository/iactivation-lwd-service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../Models/apiresponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivationLwdServiceService implements IActivationLwdService {
  environment = environment;
  constructor(private http: HttpClient) {
  }

  GetEmployeeActivationLwd(companyCode: string, flag: string): Observable<APIResponse> {
    //console.log(this.environment.apiUrl + 'ActivationLwd/GetEmployeeActivationLwd/' + companyCode + '/' + flag);
    return this.http.get<APIResponse>(this.environment.apiUrl + 'ActivationLwd/GetEmployeeActivationLwd/' + companyCode + '/' + flag);
  }

  UploadEmployeeActivation(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.environment.apiUrl + 'ActivationLwd/UploadEmployeeActivation',
      formData // send as FormData directly
    );
  }
  UploadEmployeeLWD(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.environment.apiUrl + 'ActivationLwd/UploadEmployeeLWD',
      formData // send as FormData directly
    );
  }
}
