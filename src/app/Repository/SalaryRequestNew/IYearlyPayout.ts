import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IYearlyPayout {
    DownloadTemplate(Flag: any, Qzoneusername: any): Observable<APIResponse>;
    BonusDetailsSummary(Company_Id: any, FromDate: any,ToDate:any,QZoneUserName): Observable<APIResponse>;
    BonusAccumatedReport(Company_Id: any, FromDate: any,ToDate:any,QZoneUserName): Observable<APIResponse>;
    BonusReleaseUpload(payload: any): Observable<APIResponse>;
    DeductionFlasuOutSearch(Company_Id: any, payPeriodId: any,QZoneUserName): Observable<APIResponse>;
    DeductionFlasuOutUpload(payload: FormData): Observable<APIResponse>;
}