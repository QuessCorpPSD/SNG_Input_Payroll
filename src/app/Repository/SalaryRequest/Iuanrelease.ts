import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IUANRelease {
      GetInvoiceDescription(Qzoneusername): Observable<APIResponse>;
      Search(payload: any): Observable<APIResponse>;

}