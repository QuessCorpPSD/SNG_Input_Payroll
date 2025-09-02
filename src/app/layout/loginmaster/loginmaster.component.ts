import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastNoAnimation, ToastrService } from 'ngx-toastr';
import { IAuthServiceService } from '../../Repository/iauth-service.service';
import { AuthServiceService } from '../../Service/auth-service.service';
      

import { NgOptimizedImage } from '@angular/common'
import { EncryptionService } from '../../Shared/encryption.service';
import { SessionStorageService } from '../../Shared/SessionStorageService';
import { TokenService } from '../../Shared/TokenService';
import { HttpClient } from '@angular/common/http';



    
const auth= InjectionToken<IAuthServiceService>;
@Component({
  selector: 'app-loginmaster',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterLink ],
  templateUrl: './loginmaster.component.html',
  styleUrl: './loginmaster.component.css',
  encapsulation: ViewEncapsulation.None ,
  providers: [
      {
        provide: auth,
        useClass: AuthServiceService,
      }
    ]
})
export class LoginmasterComponent {
username:string = ''
  password:string = '' 
  isPasswordVisible = false; 
  isSubmitting:boolean = false;
  Name:string='';
  userDeviceData!:string;
    ipAddress: string = '::1';
 computername:string='';
  validationErrors:Array<any> = [];
  
   
  constructor(
    @Inject(auth)private _authService:IAuthServiceService, 
  private toastr: ToastrService,
  private router: Router,
  private _encry:EncryptionService,
  private sessionStorageService: SessionStorageService,
  private tokenservice:TokenService ,
  private http:HttpClient  
  ) {
   
    }
    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
  
    }
    togglePassword() {
      this.isPasswordVisible = !this.isPasswordVisible;
    }
   
  ngOnInit(): void {
    // localStorage.clear();
  //sessionStorage.clear();
 if (!this.router.navigated) {
    location.reload(); // Only if you need hard reload
  }
  // Optionally clear any custom cache service data
  //this.cacheService?.clear(); // if you're using a caching service
   this.http.get('http://localhost:7000', { responseType: 'text' })
      .subscribe({
        next: (response: string) => {
          
          // If you're using jQuery (not recommended), you can do:
          this.computername=response
         // console.log("Computer Name " +this.computername);
          // Angular way (recommended):
          // this.companyName = response;
        },
        error: (error) => {
          console.error('Error fetching data', error);
        }
      });
    //console.log(this.deviceInfo);
  }
 
 getIpAddress(): void {
    this.http.get('https://api.ipify.org?format=json').subscribe({
      next: (res: any) => {
        this.ipAddress = res.ip;
      },
      error: (err) => {
        console.error('Error fetching IP:', err);
      }
    });
  }
   roleIdGroups: Record<Role, number[]> = {
  [Role.Admin]: [1,12, 14, 17, 20,38, 52, 263],
  [Role.SOP]: [0],
  [Role.Manager]: [] // fallback
};
 
getUserRole(roleId: number): Role {
  for (const role in this.roleIdGroups) {
    if (this.roleIdGroups[role as Role].includes(roleId)) {
      return role as Role;
    }
  }
  return Role.Manager;
}
 validateLogin(): void {
  if (!this.username || this.username.trim() === '') {
    this.toastr.error("Please Enter Employee Code", "Error");
    return;
  }

  if (!this.password || this.password.trim() === '') {
    this.toastr.error("Please Enter Password", "Error");
    return;
  }

 

 ///this.getIpAddress();


    
   const login = {
    username: this.username,
    password: this.password,
    ipAddress:this.ipAddress,
    Cname:this.computername,
  };
  
  this._authService.ValidateLogin(login).subscribe({
    next: (loginStatus) => {
      const data = loginStatus.Data;
      console.log(data);
      if (data.error_Message === "" && data.user_Id > 0) {
        this.Name = data.userName;
        this.sessionStorageService.setItem('UserProfile', this._encry.encrypt(JSON.stringify(data)));
        this.tokenservice.setTokens(
          this._encry.encrypt(data.token),
          this._encry.encrypt(data.refreshtoken)
        );
;
        if (this.getUserRole(data.role_Id)=='admin') {
          this.router.navigateByUrl('/Master/dashboard');
        } else {
          this.router.navigateByUrl('/Master/Home');
        }
      } else {
        this.toastr.error(data.error_Message || "Invalid credentials", "Error");
        this.router.navigate(['/Login']);
      }
    },
    error: (err) => {
      console.error(err);
      this.toastr.error(err.message, "Error");
    }
  });
}

}
enum Role {
  Admin = 'admin',
  SOP = 'SOP',
  Manager = 'manager'
}
