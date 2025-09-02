import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../Models/apiresponse';

export interface IAuthServiceService {
  ValidateLogin(login):Observable<APIResponse>;
  GetCompanyData():Observable<APIResponse>;
  setUsername(username: string);
  PayRegisterDownload():Observable<Blob>
  changepassword(val):Observable<APIResponse>
 
}
