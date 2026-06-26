import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IGenericUpload } from '../../Repository/invoice/Igenericupload';

@Injectable({
  providedIn: 'root'
})
export class GenericUploadService implements IGenericUpload {
  environment = environment;
  constructor(private http: HttpClient) { }

  GetUploadTypes(userid: number): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}GenericUploadBank/GetUploadTypes/${userid}`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }

  UploadFile(formData: FormData): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}GenericUploadBank/UploadFile`;
    console.log(url);
    return this.http.post<APIResponse>(url, formData)
  }

  DownloadTemplate(uploadType: string): Observable<HttpResponse<Blob>> {
    const url = `${this.environment.apiUrl}GenericUploadBank/DownloadTemplate/${uploadType}`;
    return  this.http.get(url, { responseType: 'blob', observe: 'response' });
  }

}
