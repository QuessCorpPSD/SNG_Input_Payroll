import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { IGenericUpload } from '../../Repository/banknonvoice/IGenericUpload.services';

@Injectable({
  providedIn: 'root'
})
export class GenericuploadService implements IGenericUpload {
  env = environment
  constructor(private http: HttpClient) { }

  GetUploadType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'GenericUploadProcess/GenericUploadType')
  }
  DownloadTemplate(uploadType: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'GenericUpload/DownloadTemplate/' +
      encodeURIComponent(uploadType)
    );
  }
  Importgenericupload(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'GenericUploadProcess/GenericUpload', payload)
  }
}
