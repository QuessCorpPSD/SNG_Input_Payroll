import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IReleaseRequest {
    DownloadTemplate(Flag: any, Qzoneusername: any): Observable<APIResponse>;
    SearchReleaseRequest(Companay_Id: any, PayPeriod_Id: any, Qzoneusername: any): Observable<APIResponse>;
    ExportReleaseRequest(Companay_Id: any, PayPeriod_Id: any, Qzoneusername: any): Observable<APIResponse>;
    GetAllHold(Companay_Id: any, PayPeriod_Id: any,Flag:any,Invoice_No: any, Qzoneusername: any): Observable<APIResponse>;
    UploadSalaryReleaseRequest(payload: any): Observable<APIResponse>;
    SearchAllReleaseRequest(Companay_Id: any, PayPeriod_Id: any,Flag:any,InvoiceNo:any, Qzoneusername: any): Observable<APIResponse>;
    HoldReleaseRequest(payload:any):Observable<APIResponse>;
    PartialHoldRelease(payload:any):Observable<APIResponse>;
    DBTHoldRelease(payload:any):Observable<APIResponse>;
}