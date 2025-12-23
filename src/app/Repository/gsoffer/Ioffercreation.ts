import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";
import { HttpResponse } from "@angular/common/http";

export interface Ioffercreation {
    Formscreation(): Observable<APIResponse>;
}