import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";

export interface IDashBoardServices {

    GetUserDashBoard(userId):Observable<APIResponse>;
    UserCheckIn(userId,Type):Observable<APIResponse>;
    getadmindashboard():Observable<APIResponse>
    getadmindashboarddetail(val):Observable<APIResponse>
    getadminPendingLot():Observable<APIResponse>
}