import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { IAttendanceBatchidupdate } from '../../Repository/Process/Attendancebatchidupdate.service';

@Injectable({
  providedIn: 'root'
})
export class AttendancebatchitupdateService implements IAttendanceBatchidupdate {
  env = environment;
  httpClient: any;
  constructor(private http: HttpClient) {

  }

  Upload(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'AttendanceBatchIdUpdate/ImportAttendanceBatchIdUpdate',
        formData
      );
  }
}
