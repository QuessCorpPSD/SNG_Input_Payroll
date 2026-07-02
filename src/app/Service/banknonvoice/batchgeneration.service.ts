import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { IBatchGeneration } from '../../Repository/banknonvoice/IBatchGeneration';


@Injectable({
    providedIn: 'root'
})
export class BatchGenerationService implements IBatchGeneration {

    env = environment;

    constructor(private http: HttpClient) { }

    GetBatchTypeList(userid): Observable<APIResponse> {
        return this.http.get<APIResponse>(
            this.env.apiUrl +
            'NIBatchGeneration/GetBatchTypeList/' + userid
        );
    }

    EntityListbg(userid): Observable<APIResponse> {
        return this.http.get<APIResponse>(
            this.env.apiUrl +
            'NIBatchGeneration/EntityListbg/' + userid
        );
    }

    BatchCreationTypelist(userid): Observable<APIResponse> {
        return this.http.get<APIResponse>(
            this.env.apiUrl +
            'NIBatchGeneration/BatchCreationTypelist/' + userid
        );
    }

    GetSalaryreleaseProcessdata(BatchType: any, EntityId: any, BatchCreationType: any, Status: any, UserId: any): Observable<APIResponse> {
        return this.http.get<APIResponse>(
            this.env.apiUrl +
            'NIBatchGeneration/GetSalaryreleaseProcessdata/' + BatchType + '/' + EntityId + '/' + BatchCreationType + '/' + Status + '/' + UserId
        );
    }

    GetTemplate(userid: any, Flag: any): Observable<APIResponse> {
        return this.http.get<APIResponse>(
            this.env.apiUrl +
            'NIBatchGeneration/GetTemplate/'+ Flag+ '/'+userid 
        );
    }

    GetSalaryreleaseProcessExport(BatchType: any, EntityId: any, batchCreationTypes: any, Status: any, UserId: any): Observable<APIResponse> {
        return this.http.get<APIResponse>(
            this.env.apiUrl +
            'NIBatchGeneration/GetSalaryreleaseProcessExport/' + BatchType + '/' + EntityId + '/' + batchCreationTypes + '/' + Status + '/' + UserId
        );
    };

    BatchGenerate(payload): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            `${this.env.apiUrl}NIBatchGeneration/BatchGenerate`,
            payload
        );
    };

    UploadCollectionStatus(formData: FormData): Observable<APIResponse> {
        return this.http.post<APIResponse>(
          this.env.apiUrl + 'NIBatchGeneration/UploadCollectionStatus',
          formData
        );
      }

      Rejectgroup(BatchType:any,Salary_Process_Initiate_detail_Id:any,UserId:any): Observable<APIResponse>{
        return this.http.post<APIResponse>(
            `${this.env.apiUrl}NIBatchGeneration/Rejectgroup/${BatchType}/${Salary_Process_Initiate_detail_Id}/${UserId}`,
            {}
        );
      };


}