import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';


export interface IHolidayService {

    GetHolidayCompanywise(CompanyId: string, SiteId: string): Observable<APIResponse>;
    GetHolidayTemplate(): Observable<APIResponse>;
    UploadHolidayMaster(formData:FormData): Observable<APIResponse>;
    SaveUpdateDeleteHolidayMaster(payload:any):Observable<APIResponse>;
}
