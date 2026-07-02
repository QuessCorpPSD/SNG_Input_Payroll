import { Injectable } from '@angular/core';
import { IHolidayService } from '../../Repository/Master/iholiday.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class HolidayService implements IHolidayService {

  environment = environment;
  constructor(private http: HttpClient) {
  }

 GetHolidayCompanywise(CompanyId: string, SiteId: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'HolidayMaster/GetHolidayCompanywise/' + CompanyId + '/' + SiteId);
  }  
  GetHolidayTemplate(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'HolidayMaster/GetHolidayTemplate');
  }  
  UploadHolidayMaster(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.environment.apiUrl + 'HolidayMaster/UploadHolidayMaster',
      formData // send as FormData directly
    );
  }

  SaveUpdateDeleteHolidayMaster(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.environment.apiUrl + 'HolidayMaster/SaveUpdateDeleteHolidayMaster',
      formData // send as FormData directly
    );
  }
}
