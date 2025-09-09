import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";

export interface IOnboardingServices {

    GetOnboardingData(companyCode:string, payPeriod:string):Observable<APIResponse>;
    GetNewJoineeTemplate(formData:FormData):Observable<APIResponse>;
    MovetoQpay(offerIdJson: string,companyId: number,payPeriod: string, payPeriodId: number, userId: string):Observable<APIResponse>;
    PostValidateOfferId(offerId:string):Observable<APIResponse>;
    PostRollbackOfferId(offerId:string, userId: string):Observable<APIResponse>;
    PostNewJoineeData(formData:FormData):Observable<APIResponse>;
    PostAttendanceData(formData:FormData):Observable<APIResponse>;
    VerifyAttendanceHeaders(formData2:FormData):Observable<APIResponse>;
    PostOneTimeInputData(formData:FormData):Observable<APIResponse>;
    GetCurrentPayperiod(companyId: any): Observable<APIResponse>;
    GetFinalSubmitData(companyId:number,payPeriodId: number, inputId: number, userId: string):Observable<APIResponse>;
    GetPayRegister(formData:FormData):Observable<APIResponse>;
    PostFinalSubmission(formData:FormData):Observable<APIResponse>;
    GetNewJoineeEmployeeId(formData:FormData):Observable<APIResponse>;
    GetConsolidatedPayRegister(formData:FormData):Observable<APIResponse>;
}