import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IFNFrevoke {
    UploadFNFrevoke(formData: FormData): Observable<APIResponse>

}