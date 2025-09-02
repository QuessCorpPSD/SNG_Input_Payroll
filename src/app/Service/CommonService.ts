import { HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { ICommonService } from "../Repository/ICommonService";
import { APIResponse } from "../Models/apiresponse";
import { map, Observable } from "rxjs";
import { Injectable } from "@angular/core";
@Injectable({
  providedIn: 'root'
})
export class CommonService implements ICommonService {
    environment = environment
    constructor(private http: HttpClient) {

    }
      UserCreate(login):Observable<APIResponse>{
    var inputval=JSON.stringify(login);
   
    const config = new HttpHeaders().set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    return this.http.post<APIResponse>(this.environment.apiUrl+"Authendicate/UserCreate",inputval, { headers: config }).pipe(
      map(userInfo=> {
        let data=userInfo.Data;       
        return userInfo;
        //return userInfo.headers.get('authorization');
      }));
  }
    GetProcessCategory(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + "Common/GetAllProcessCategory")
    }
    GetReporting(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/GetReporting")
    }
    GetTeamLeader(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/GetAllTeamLead")
    }
    GetMangers(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/GetAllManager")
    }
    GetFun_Head(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/GetAllFunctionalityHead")
    }
    GetRoles(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + "Common/GetAllActiveRole")
    }
    GetAccessType(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + "Common/GetAccessType")
    }
    GetFinancialYears(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + "Common/GetFinancialYear")
    }
    GetUserById(userId):Observable<APIResponse>
    {
        return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/GetUserById/"+userId)
    }
     GetUserByEmployeeId(employeeID):Observable<APIResponse>
     {
        return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/UserByEmployeeId/"+employeeID)
     }
     GetAllUser():Observable<APIResponse>{
        return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/GetAllActiveUsers")
     }
}