import { EnvironmentInjector, Injectable, signal } from '@angular/core';
import { IAuthServiceService } from '../Repository/iauth-service.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { APIResponse } from '../Models/apiresponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService implements IAuthServiceService {
   environment=environment;
   private usernameSubject = new BehaviorSubject<string>('');
   username$ = this.usernameSubject.asObservable();
   private usernameSignal = signal<string | null>(null);
  constructor(private http:HttpClient) { }

  ValidateLogin(login):Observable<APIResponse>{
    var inputval=JSON.stringify(login);
   
    const config = new HttpHeaders().set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    return this.http.post<APIResponse>(this.environment.apiUrl+"Authendicate/UserLogin",inputval, { headers: config }).pipe(
      map(userInfo=> {
        let data=userInfo.Data;       
        return userInfo;
        //return userInfo.headers.get('authorization');
      }));
  }
  
changepassword(val):Observable<APIResponse>
{
  var inputval=JSON.stringify(val);
   
    const config = new HttpHeaders().set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    return this.http.post<APIResponse>(this.environment.apiUrl+"Authendicate/ChangePassword",inputval, { headers: config })     
   
}
  GetCompanyData():Observable<APIResponse>{
    return this.http.get<APIResponse>(this.environment.apiUrl+'Authendicate/GetData');
  }
  getCompanyName() {
    this.http.get('http://localhost:7000/', { responseType: 'text' })
      .subscribe({
        next: (response: string) => {
          // If you're using jQuery (not recommended), you can do:
          
          
          // Angular way (recommended):
          // this.companyName = response;
        },
        error: (error) => {
          console.error('Error fetching data', error);
        }
      });
  }
  setUsername(username: string) {
    
    this.usernameSubject.next(username); // Set username
  }
  PayRegisterDownload(): Observable<Blob> {
    return this.http.get<Blob>(this.environment.apiUrl + 'Authendicate/PayRegisterDownload')
  }

  
}
