// app/core/services/background-check.service.ts
import { Injectable, effect, signal } from '@angular/core';
import { timer, switchMap } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { APIResponse } from '../Models/apiresponse';

@Injectable({
  providedIn: 'root' // ensures it's a singleton, auto-injected
})
export class BackgroundCheckService {
  private pollingInterval = 10000; // 2 minutes
  private lastResult = signal<any>(null);
environment = environment;
  constructor(private http: HttpClient) {
    this.startBackgroundTask();
  }

startBackgroundTask() {
  console.log('startBackgroundTask triggered');

  timer(0, this.pollingInterval)
    .pipe(
      switchMap(() => {
        console.log('Started the Polling...');
       const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      
    });
        console.log(this.environment.apiUrl + 'Common/GetAllActiveRole')
        return this.http.get<APIResponse>('https://localhost:7087/api/Common/GetAllActiveRole',{headers});
      })
    )
    .subscribe({
      next: (res) => {
        this.lastResult.set(res);
        console.log('Background data:', res);
      },
      error: (err) => {
        //console.error('Polling error', err);
        console.error('Polling error', err.message);
  console.error('Status:', err.status);
  console.error('Full error:', err);
      }
    });
}




//   startBackgroundTask() {
    
//     timer(0, this.pollingInterval)
//       .pipe(
//         switchMap(() => this.http.get<APIResponse>(this.environment.apiUrl+'Authendicate/GetReporting')) // Replace with your API
//       )
//       .subscribe({
//         next: (res) => {
//           this.lastResult.set(res);
//           console.log('Background data:', res);
//         },
//         error: (err) => {
//           console.error('Polling error', err);
//         }
//       });
//   }

  get result() {
    return this.lastResult.asReadonly();
  }
}
