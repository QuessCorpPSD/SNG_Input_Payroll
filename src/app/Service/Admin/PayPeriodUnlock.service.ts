import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { HttpClient } from '@angular/common/http';
import { IPayPeriodUnlock } from '../../Repository/Admin/IPayPeriodUnlock.service';


@Injectable({
    providedIn: 'root'
})
export class PayPeriodUnlockService implements IPayPeriodUnlock {

    env = environment

    constructor(private http: HttpClient) { }

    Search(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'PayPeriodUnlock/Search')
    }

    Unlock(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(this.env.apiUrl + 'PayPeriodUnlock/Unlock', payload)
    }
}
