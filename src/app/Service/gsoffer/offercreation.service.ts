import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { Ioffercreation } from '../../Repository/gsoffer/Ioffercreation';

@Injectable({
  providedIn: 'root'
})
export class OffercreationService implements Ioffercreation {
 env = environment

  constructor(private http: HttpClient) { }

  Formscreation(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'FormCreation/Search/0/0/0/0')
  }

}
