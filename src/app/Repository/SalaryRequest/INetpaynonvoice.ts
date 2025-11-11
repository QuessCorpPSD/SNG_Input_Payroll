import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface INetpaynonvoice {
     DownloadTemplate(companycode: any, payperiodid: any, Qzoneusername: any): Observable<APIResponse>;
}