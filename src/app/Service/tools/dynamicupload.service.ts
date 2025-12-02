import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class DynamicuploadService {
  BulkPOUpload(formData: FormData) {
    throw new Error('Method not implemented.');
  }
  env = environment;
  httpClient: any;
  constructor(private http: HttpClient) {

  }

  getuploadtype(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'DynamicUpload/GetUploadType'
    );
  }
  getallcolumns(uploadtype: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'DynamicUpload/GetAllColumns/' + uploadtype
    );
  }
  Upload(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'DynamicUpload/FileUpload',
        formData
      );
  }
}
