import { HttpClient, HttpHeaders } from "@angular/common/http";
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
  UserCreate(login): Observable<APIResponse> {
    var inputval = JSON.stringify(login);

    const config = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    return this.http.post<APIResponse>(this.environment.apiUrl + "Authendicate/UserCreate", inputval, { headers: config }).pipe(
      map(userInfo => {
        let data = userInfo.Data;
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
  GetUserById(userId): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/GetUserById/" + userId)
  }
  GetUserByEmployeeId(employeeID): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/UserByEmployeeId/" + employeeID)
  }
  GetAllUser(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + "Authendicate/GetAllActiveUsers")
  }
  GetCompanyCodes(userId: number): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetAllCompanyCode/${userId}`;
    console.log(url);
    return this.http.get<APIResponse>(url);
  }
  GetAllState(): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetAllState`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }
  GetCityByStateId(stateId): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetCityByStateId/${stateId}`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }

  GetPayperiodbyCompany(companyId: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetAllPayperiod/${companyId}`;
    console.log(url);
    return this.http.get<APIResponse>(url);
  }
  GetCurrentPayperiod(companyId: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetCurrentPayperiod/${companyId}`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }
  GetMapNamebyCompany(companyId: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetMapNamebyCompany/${companyId}`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }
  GetInputType(): Observable<APIResponse> {
    //console.log(this.environment.apiUrl + "Common/GetAllInputType");
    return this.http.get<APIResponse>(this.environment.apiUrl + "Common/GetAllInputType")
  }
  LotStatus(formData: FormData): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetLotwisePSDStatus`;
    //console.log(url);
    return this.http.post<APIResponse>(url, formData);
  }

  GetSitesByCompanyId(companyId: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetSitesByCompanyId/${companyId}`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }

  GetCityByCompanyCode(companyId: any, Group_Id: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}Common/GetCityByCompanyCode/${companyId}/${Group_Id}`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }
}