import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { IPayRegisterService } from '../../Repository/Process/IPayRegisterUpload.service';

@Injectable({
  providedIn: 'root'
})
export class PayregisteruploadService implements IPayRegisterService {

  env = environment

  constructor(private http: HttpClient) { }

  exportPayRegisterUpload(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'PayRegisterUpload/ExporttoExcel', payload)
  }

  importPayRegisterUpload(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'PayRegisterUpload/ImportPayRegister', payload)
  }

  downloadTemplate(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'PayRegisterUpload/DownloadTemplate', payload)
  }

}
