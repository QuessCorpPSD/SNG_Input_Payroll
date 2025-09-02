import { Injectable } from "@angular/core";
import { IDashBoardServices } from "../Repository/IDashBoardService";
import { environment } from "../../environments/environment.development";
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { APIResponse } from "../Models/apiresponse";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DashBoardServices implements IDashBoardServices {
    environment=environment;
    constructor(private http:HttpClient)
    {

    }

    GetUserDashBoard(userId):Observable<APIResponse>
    {
        return this.http.get<APIResponse>(this.environment.apiUrl+'DashBoard/GetDashBoardByUserId/'+userId);
    }
    UserCheckIn(userId,Type):Observable<APIResponse>
    {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'CheckInCheckOut/CheckIn/' + userId + '/' + Type)
    }
    getadmindashboard():Observable<APIResponse>
    {
        return this.http.get<APIResponse>(this.environment.apiUrl+'DashBoard/GetAdminDashBoard')
    }
    getadmindashboarddetail(val):Observable<APIResponse>
    {
        const url = `${this.environment.apiUrl}DashBoard/GetAdminDashBoardDetail`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        var inputval = JSON.stringify(val);
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });

    }
    getadminPendingLot():Observable<APIResponse>
    {
        return this.http.get<APIResponse>(this.environment.apiUrl+'DashBoard/PendingLot') 
    }
}