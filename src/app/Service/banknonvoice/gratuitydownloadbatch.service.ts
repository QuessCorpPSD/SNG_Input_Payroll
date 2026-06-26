import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { IGratuityDownloadBatch } from '../../Repository/banknonvoice/IGratuityDownloadBatch.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';


@Injectable({
  providedIn: 'root'
})
export class GratuitydownloadbatchService implements IGratuityDownloadBatch {

  env = environment
  getId: any;
  constructor(private http: HttpClient) { }

  GetBatchid(BatchDate: any, GetBatch: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'GratuityDownloadBatch/GetGratuityBatchidReport/' + BatchDate + '/' + GetBatch);
  }

  ExporttoExcel(filename: any): Observable<Blob> {
    return this.http.get(this.env.apiUrl + 'GratuityDownloadBatch/GetBatchZipFile?filename=' + filename,
      {
        responseType: 'blob'
      }
    );
  }


}
