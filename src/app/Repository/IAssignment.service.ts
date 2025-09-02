import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";

export interface IAssignmentService {
      GetAssignmentLot(userid,filterType):Observable<APIResponse>;
      
      GetAllotment(val):Observable<APIResponse>;
      PayRegisterDownload(val):Observable<APIResponse>
      ReconPayRegisterDownload(val):Observable<APIResponse>
      PayRegisterUpload(val):Observable<APIResponse>
      LotStatus(val):Observable<APIResponse>
      QCLotVerify(val):Observable<APIResponse>
      InputFileDownload(val):Observable<APIResponse>
      OutPutFileDownload(val):Observable<APIResponse>
      LotValidationEstimate(val):Observable<APIResponse>
      UserLotValidation(val):Observable<APIResponse>
      UserLotValidationAdd(val):Observable<APIResponse>
      FeedBackMail(val):Observable<APIResponse>;
      GetSOP_QA(): Observable<APIResponse>;
      getApiOptions(url: string): Observable<any[]>;
      GetCompanyDetails(val:any): Observable<APIResponse>;
      GetCategory(): Observable<APIResponse>;
      GetQuestion(val): Observable<APIResponse>;
      GetQuestionBySubId(val): Observable<APIResponse>;
      GetMenuAsync(val): Observable<APIResponse>;
      GetDesignation(val): Observable<APIResponse>;
      GetSOPAnswer1(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer1(val):Observable<APIResponse>;
      GetSOPAnswer2(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer2(val):Observable<APIResponse>;
      GetSOPAnswer3(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer3(val):Observable<APIResponse>;
      GetSOPAnswer6(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer6(val):Observable<APIResponse>;
      GetSOPAnswer8(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer8(val):Observable<APIResponse>;
      GetSOPAnswer9(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer9(val):Observable<APIResponse>;
      GetSOPAnswer10(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer10(val):Observable<APIResponse>;
      GetSOPAnswer5(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer5(val):Observable<APIResponse>;
      GetSOPAnswer7(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer7(val):Observable<APIResponse>;
      GetSOPAnswer12(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer12(val):Observable<APIResponse>;
      GetSOPAnswer13(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer13(val):Observable<APIResponse>;
      GetSOPAnswer14(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer14(val):Observable<APIResponse>;
      GetSOPAnswer16(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer16(val):Observable<APIResponse>;
      GetSOPAnswer17(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer17(val):Observable<APIResponse>;
      GetSOPAnswer18(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer18(val):Observable<APIResponse>;
      GetSOPAnswer19(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer19(val):Observable<APIResponse>;
      GetSOPAnswer21(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer21(val):Observable<APIResponse>;
      GetSOPAnswer23(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer23(val):Observable<APIResponse>;
      GetSOPAnswer25(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer25(val):Observable<APIResponse>;
      GetSOPAnswer28(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer28(val):Observable<APIResponse>;
      GetSOPAnswer29(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer29(val):Observable<APIResponse>;
      GetSOPAnswer30(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer30(val):Observable<APIResponse>;
      GetSOPAnswer32(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer32(val):Observable<APIResponse>;
      GetSOPAnswer36(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer36(val):Observable<APIResponse>;
      GetSOPAnswer37(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer37(val):Observable<APIResponse>;
      GetSOPAnswer38(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer38(val):Observable<APIResponse>;
      GetSOPAnswer27(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer27(val):Observable<APIResponse>;
      GetSOPAnswer39(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer39(val):Observable<APIResponse>;
      GetmarkedQuestion(val):Observable<APIResponse>;
      GetSOPAnswer4(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer4(val):Observable<APIResponse>;
      GetSOPAnswer33(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer33(val):Observable<APIResponse>;
      PostSOPAnswer31(val):Observable<APIResponse>;
      PostSOPAnswer31_1(val):Observable<APIResponse>;
      GetSOPAnswer31(val1: string,val2: string): Observable<APIResponse>;
      GetSOPAnswer11(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer11(val):Observable<APIResponse>;
      GetSOPAnswer15(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer15(val):Observable<APIResponse>;
      PostSOPAnswer20(val):Observable<APIResponse>;
      GetSOPAnswer20(val1: string,val2: string): Observable<APIResponse>;
      PostSOPAnswer22(val):Observable<APIResponse>;
      GetSOPAnswer22(val1: string,val2: string): Observable<APIResponse>;
}