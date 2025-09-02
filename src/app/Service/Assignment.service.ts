import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { APIResponse } from "../Models/apiresponse";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IAssignmentService } from "../Repository/IAssignment.service";


@Injectable({
  providedIn: 'root'
})
export class AssignmentService implements IAssignmentService {
    environment = environment;
    constructor(private http: HttpClient) {

    }
    GetAssignmentLot(userid,filterType): Observable<APIResponse> {
       
        return this.http.get<APIResponse>(this.environment.apiUrl + 'Assignment/GetAssignmentLot/' + userid+'/'+filterType)
    }
    GetAllotment(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'Assignment/GetAllotment', inputval, { headers: config })
    }
    PayRegisterDownload(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'PayRegister/GetPayRegister', inputval, { headers: config })
    }
    ReconPayRegisterDownload(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'PayRegister/GetReconPayRegister', inputval, { headers: config })
    }
    InputFileDownload(val): Observable<APIResponse> {

        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json');           
        return this.http.post<APIResponse>(this.environment.apiUrl + 'Assignment/InputLotDownload', inputval, { headers: config })
    }

    getApiOptions(url: string): Observable<any[]> {
        console.log('API Fetch Initiated:', url);
        return this.http.get<any[]>(url);
    }

    GetSOP_QA(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetCustomerSOPQuestionAnswer');
    }

    PayRegisterUpload(val: any): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'PayRegister/PayRegisterUpload', inputval, { headers: config })
    }

    LotStatus(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'Assignment/LotStatus', inputval, { headers: config })
    }
    QCLotVerify(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
       
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'Assignment/QCLotVerify', inputval, { headers: config })
    }

    GetCompanyDetails(val: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetCompanyCode?user_id=' + val);
    }

    UserLotValidation(val):Observable<APIResponse>
    {
        var inputval = JSON.stringify(val);
        
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'Assignment/UserEstimateLotValidation', inputval, { headers: config })
    }

    UserLotValidationAdd(val):Observable<APIResponse>
    {
        var inputval = JSON.stringify(val);
        console.log(inputval);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'Assignment/UserEstimateLotValidationAdd', inputval, { headers: config })
    }

    GetCategory(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetCategory');
    }

    GetQuestion(val): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetQuestion/' + val);
    }

    GetQuestionBySubId(val): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetQuestionBySubId/' + val);
    }

    GetMenuAsync(val): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetMenuAsync/' + val);
    }

    GetDesignation(val): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetDesignation/' + val);
    }

    GetSOPAnswer1(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer1/' + val1 + '/' + val2);
    }

    PostSOPAnswer1(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer1', inputval, { headers: config })
    }

    GetSOPAnswer2(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer2/' + val1 + '/' + val2);
    }

    PostSOPAnswer2(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer2', inputval, { headers: config })
    }

    GetSOPAnswer3(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer3/' + val1 + '/' + val2);
    }

    PostSOPAnswer3(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer3', inputval, { headers: config })
    }

    GetSOPAnswer6(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer6/' + val1 + '/' + val2);
    }

    PostSOPAnswer6(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer6', inputval, { headers: config })
    }

    GetSOPAnswer8(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer8/' + val1 + '/' + val2);
    }

    PostSOPAnswer8(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer8', inputval, { headers: config })
    }

    GetSOPAnswer9(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer9/' + val1 + '/' + val2);
    }

    PostSOPAnswer9(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer9', inputval, { headers: config })
    }

    GetSOPAnswer10(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer10/' + val1 + '/' + val2);
    }

    PostSOPAnswer10(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer10', inputval, { headers: config })
    }

    GetSOPAnswer5(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer5/' + val1 + '/' + val2);
    }

    PostSOPAnswer5(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer5', inputval, { headers: config })
    }

    GetSOPAnswer7(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer7/' + val1 + '/' + val2);
    }

    PostSOPAnswer7(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer7', inputval, { headers: config })
    }

    GetSOPAnswer12(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer12/' + val1 + '/' + val2);
    }

    PostSOPAnswer12(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer12', inputval, { headers: config })
    }

    GetSOPAnswer13(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer13/' + val1 + '/' + val2);
    }

    PostSOPAnswer13(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer13', inputval, { headers: config })
    }

    GetSOPAnswer14(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer14/' + val1 + '/' + val2);
    }

    PostSOPAnswer14(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer14', inputval, { headers: config })
    }

    GetSOPAnswer16(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer16/' + val1 + '/' + val2);
    }

    PostSOPAnswer16(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer16', inputval, { headers: config })
    }

    GetSOPAnswer17(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer17/' + val1 + '/' + val2);
    }

    PostSOPAnswer17(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer17', inputval, { headers: config })
    }

    GetSOPAnswer18(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer18/' + val1 + '/' + val2);
    }

    PostSOPAnswer18(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer18', inputval, { headers: config })
    }

    GetSOPAnswer19(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer19/' + val1 + '/' + val2);
    }

    PostSOPAnswer19(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer19', inputval, { headers: config })
    }

    GetSOPAnswer21(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer21/' + val1 + '/' + val2);
    }

    PostSOPAnswer21(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer21', inputval, { headers: config })
    }

    GetSOPAnswer23(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer23/' + val1 + '/' + val2);
    }

    PostSOPAnswer23(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer23', inputval, { headers: config })
    }

    GetSOPAnswer25(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer25/' + val1 + '/' + val2);
    }

    PostSOPAnswer25(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer25', inputval, { headers: config })
    }

    GetSOPAnswer28(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer28/' + val1 + '/' + val2);
    }

    PostSOPAnswer28(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer28', inputval, { headers: config })
    }

    GetSOPAnswer29(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer29/' + val1 + '/' + val2);
    }

    PostSOPAnswer29(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer29', inputval, { headers: config })
    }

    GetSOPAnswer30(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer30/' + val1 + '/' + val2);
    }

    PostSOPAnswer30(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer30', inputval, { headers: config })
    }

    GetSOPAnswer32(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer32/' + val1 + '/' + val2);
    }

    PostSOPAnswer32(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer32', inputval, { headers: config })
    }

    GetSOPAnswer36(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer36/' + val1 + '/' + val2);
    }

    PostSOPAnswer36(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer36', inputval, { headers: config })
    }

    GetSOPAnswer37(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer37/' + val1 + '/' + val2);
    }

    PostSOPAnswer37(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer37', inputval, { headers: config })
    }

    GetSOPAnswer38(val1: string, val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer38/' + val1 + '/' + val2);
    }

    PostSOPAnswer38(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer38', inputval, { headers: config })
    }

    GetSOPAnswer27(val1: string,val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer27/'+val1+'/'+val2);
    }

    PostSOPAnswer27(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer27', inputval, { headers: config })
    }

    GetSOPAnswer39(val1: string,val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer39/'+val1+'/'+val2);
    }

    PostSOPAnswer39(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer39', inputval, { headers: config })
    }

    GetmarkedQuestion(val1: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetmarkedQuestion/'+val1);
    }

    GetSOPAnswer4(val1: string,val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer4/'+val1+'/'+val2);
    }

    PostSOPAnswer4(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer4', inputval, { headers: config })
    }

    GetSOPAnswer33(val1: string,val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer33/'+val1+'/'+val2);
    }

    PostSOPAnswer33(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer33', inputval, { headers: config })
    }

    PostSOPAnswer31(formData:FormData): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer31',
            formData // send as FormData directly
          );
    }
    PostSOPAnswer31_1(formData:FormData): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer31_1',
            formData // send as FormData directly
          );
    }

    GetSOPAnswer31(val1: string,val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer31/'+val1+'/'+val2);
    }

    GetSOPAnswer11(val1: string,val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer11/'+val1+'/'+val2);
    }

    PostSOPAnswer11(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer11', inputval, { headers: config })
    }
    GetSOPAnswer15(val1: string,val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer15/'+val1+'/'+val2);
    }

    PostSOPAnswer15(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer15', inputval, { headers: config })
    }

    PostSOPAnswer20(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer20', inputval, { headers: config })
    }

    GetSOPAnswer20(val1: string,val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer20/'+val1+'/'+val2);
    }

    PostSOPAnswer22(val): Observable<APIResponse> {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/PostSOPAnswer22', inputval, { headers: config })
    }

    GetSOPAnswer22(val1: string,val2: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'QuestionAnswer/GetSOPAnswer22/'+val1+'/'+val2);
    }
    LotValidationEstimate(val):Observable<APIResponse>{
          var inputval = JSON.stringify(val);         
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl+'Assignment/UserLotStatusValidation',inputval,{ headers: config })
    }
    FeedBackMail(val):Observable<APIResponse>{
          var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl+'CheckInCheckOut/SendFeedBackMail',inputval,{ headers: config })
    }
    OutPutFileDownload(val):Observable<APIResponse>
    {
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(this.environment.apiUrl + 'PayRegister/OutFileDownload', inputval, { headers: config })
    }
}