import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IBatchGeneration {

    GetBatchTypeList(userid: any): Observable<APIResponse>;
    GetTemplate(userid: any,Flag:any): Observable<APIResponse>;
    EntityListbg(userid: any): Observable<APIResponse>;
    BatchCreationTypelist(userid: any): Observable<APIResponse>;
    GetSalaryreleaseProcessdata(BatchType:any,EntityId:any,batchCreationTypes:any,Status:any,UserId:any): Observable<APIResponse>;
    GetSalaryreleaseProcessExport(BatchType:any,EntityId:any,batchCreationTypes:any,Status:any,UserId:any): Observable<APIResponse>;
    BatchGenerate(payload): Observable<APIResponse>;
    UploadCollectionStatus(formData: FormData): Observable<APIResponse>;
    Rejectgroup(BatchType:any,Salary_Process_Initiate_detail_Id:any,UserId:any): Observable<APIResponse>;
}