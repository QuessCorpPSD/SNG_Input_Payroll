import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IVANPayment {
    // ViewVanPaymentRequestList(payload: any): Observable<APIResponse>
    GetCompanyCodes(userId: number): Observable<APIResponse>;
    UploadVANPayment(formData: FormData): Observable<APIResponse>;
    DownloadTemplate(Flag: any, Qzoneusername: any, createdBy: any): Observable<APIResponse>;
    searchAndDownloadExcel(payload: any): Observable<APIResponse>;

}