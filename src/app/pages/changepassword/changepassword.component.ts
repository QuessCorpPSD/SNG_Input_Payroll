import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionStorageService } from '../../Shared/SessionStorageService';
import { EncryptionService } from '../../Shared/encryption.service';
import { IAuthServiceService } from '../../Repository/iauth-service.service';
import { AuthServiceService } from '../../Service/auth-service.service';

const auth= InjectionToken<IAuthServiceService>;

@Component({
  selector: 'app-changepassword',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.css',
  providers: [
        {
          provide: auth,
          useClass: AuthServiceService,
        }
      ]
})
export class ChangepasswordComponent {
forgotForm!:FormGroup

  password: boolean=false;
  constructor(@Inject(auth) private _authService:IAuthServiceService, private fb:FormBuilder,private decry:EncryptionService,      
      private _sessionStoreage:SessionStorageService ,){
   this.forgotForm= this.fb.group({
    "currentPassword":new  FormControl('',Validators.required),
      "Password":new  FormControl('',Validators.required),
      "ConfirmPassword":new  FormControl('',Validators.required)
    });
  }
  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('Password')?.value;
    const confirmPassword = form.get('ConfirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
  onSubmit() {
const userdetail= this._sessionStoreage.getItem('UserProfile');
  var user = JSON.parse(this.decry.decrypt(userdetail!));
  
    const request ={
      "User_Id" :user.user_Id,
      "employeeId" :user.employeeID,
      "UserName":user.userName,
      "OldPassword":this.forgotForm.get("currentPassword")?.value,
      "NewPassword":this.forgotForm.get("Password")?.value,
      "ConformNewPassword":this.forgotForm.get("ConfirmPassword")?.value,
      "Salt":user.salt,
      "Error_Message":""
    }
    
    this._authService.changepassword(request).subscribe({
      next: res => { this.forgotForm.reset(); alert(res.Data.error_Message); },
      error: err => { console.log(err) }
    })
    // this.forgotForm.get('Password')?.valueChanges.subscribe(value => {
    //   console.log('Password changed:', value);
    // });
  }
}
