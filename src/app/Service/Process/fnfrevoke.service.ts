import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IFNFrevoke } from '../../Repository/Process/IFNFrevoke';



@Injectable({
  providedIn: 'root'
})
export class FNFRevokeService implements IFNFrevoke {
  env = environment
  constructor(private http: HttpClient) {
  }
  UploadFNFrevoke(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'FNFRevoke/ImportFNFRevoke',
        formData
      );
  }


}
