import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { IDownloadBatch } from '../../Repository/banknonvoice/IDownloadbatch';


@Injectable({
    providedIn: 'root'
})
export class DownloadBatchService implements IDownloadBatch {

    env = environment;

    constructor(private http: HttpClient) { }

    GetBatchTypeList(userid): Observable<APIResponse> {
        return this.http.get<APIResponse>(
            this.env.apiUrl +
            'NIBatchGeneration/GetBatchTypeList/' + userid
        );
    }

    GetBatchList(BatchType: any, BatchDate: any, UserId: any): Observable<APIResponse> {
        return this.http.get<APIResponse>(
            this.env.apiUrl +
            'NIBatchGeneration/GetBatchList/' + BatchType + '/' + BatchDate + '/' + UserId
        );
    }

    DownloadBatchFile(BatchId): Observable<any> {
        return this.http.get(
            `${this.env.apiUrl}NIBatchGeneration/DownloadBatchFile/${BatchId}`,
            {
                observe: 'response',
                responseType: 'blob'
            }
        );
    }




}