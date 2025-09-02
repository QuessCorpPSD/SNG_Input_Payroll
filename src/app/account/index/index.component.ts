import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, inject, InjectionToken, OnInit } from '@angular/core';


import { FormsModule } from '@angular/forms';
import { IAuthServiceService } from '../../Repository/iauth-service.service';
import { AuthServiceService } from '../../Service/auth-service.service';
import { ToastrService, ToastNoAnimation } from 'ngx-toastr';
import { APIResponse } from '../../Models/apiresponse';
import { Router } from '@angular/router';
import { RouterOutlet,RouterLink  } from '@angular/router';


const auth= InjectionToken<IAuthServiceService>;
@Component({
  selector: 'app-index',
  standalone: true,
  imports: [FormsModule,CommonModule,ToastNoAnimation,RouterOutlet,RouterLink  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
  providers: [
    {
      provide: auth,
      useClass: AuthServiceService,
    }
  ]
})
export class IndexComponent implements OnInit {
  username:string = ''
  password:string = ''  
  isSubmitting:boolean = false;
  validationErrors:Array<any> = [];
   
  constructor(
    @Inject(auth)private _authService:IAuthServiceService, 
  private toastr: ToastrService,
  private router: Router,
  
  @Inject(DOCUMENT) private document: Document
  ) {
   
    }
  
  
  ngOnInit(): void {
    
  }



 

  validateLogin(): void {

            var login={
              "username":this.username ,
              "password":this.password
          };

          this._authService.ValidateLogin(login).subscribe((loginStatus)=>{           
           
          
            if(loginStatus.Data.error_Message =="" && loginStatus.Data.user_Id>0 )
            {            
              console.log("Redirect");
              localStorage.setItem('token',loginStatus.Data.password)
              //this.router.navigate(['/Home']);
              this.router.navigateByUrl('/Master/Home');
            }
            else{
              this.toastr.error(loginStatus.Data.error_Message, "Error");
              this.router.navigate(['/Login']);
            }
          },error=>{
            this.toastr.error("Please check Interner", "Error");
          })
    
      // this._Auth.authenticate(login).subscribe((response)=>
      // {
      //   console.log(response);
      //   if (response.StatusCode == 200) {
      //     let data = response.Data;
      //     console.log("data");
      //     console.log(data);
      //     if (data.error_Message == "") {
      //       this.router.navigate(['/Home']);
      //     }
      //     else {
      //       this.router.navigate(['/Login']);
      //       this.toastr.error(data.error_Message, "Error");
      //     }
      //   }
      //   else {
      //     this.router.navigate(['/Login']);
      //     this.toastr.error("User Name and Password are mismatched !!!", "Error");
      //   }
      // });
  }
}
