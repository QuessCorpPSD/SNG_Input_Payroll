import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, InjectionToken, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ICommonService } from '../../../Repository/ICommonService';
import { CommonService } from '../../../Service/CommonService';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';

const common= InjectionToken<ICommonService>;

@Component({
  selector: 'app-user-mapping',
  standalone: true,
  imports: [MatFormFieldModule,MatSelectModule,CommonModule,MatInputModule,ReactiveFormsModule,FormsModule],
  templateUrl: './user-mapping.component.html',
  styleUrl: './user-mapping.component.css',
  providers: [
        {
          provide: common,
          useClass: CommonService,
        }
      ]
})
export class UserMappingComponent implements OnInit {
  AddUser!:FormGroup;
  ProcessCategory:any;
  roles:any;
  reporting:any;
  teamLead:any;
  Managers:any;
  fun_head:any;
  accessType:any;
  ispasswordmatch:boolean=false;
  constructor(private fb:FormBuilder,
 @Inject(common)private _commonService:ICommonService,
 private sessionStorageService: SessionStorageService,
 private _encry:EncryptionService
 ){
    
  }
  // Custom validator to match passwords
passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('Password')?.value;
  const confirmPassword = group.get('ConPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
};

  onTeamSelectChange()
  {
   
   const selected = this.AddUser.get('TeamLeadUserId')?.value;
   
    this._commonService.GetUserById(selected).subscribe({
      next:res=>{
        if(res.StatusCode==200)
        {
          const email = res.Data.mail_Id;
          this.AddUser.patchValue({
            TeamLeadEmailId: email
          })
        }
      }
    })
   
  }
  onFunHeadSelectChange()
  {
    
   const selected = this.AddUser.get('Fun_Manager_User_Id')?.value;
   
    this._commonService.GetUserById(selected).subscribe({
      next:res=>{
        if(res.StatusCode==200)
        {
          const email = res.Data.mail_Id;
          this.AddUser.patchValue({
            Fun_Manager_Email_Id: email
          })
        }
      }
    })
   
  }
   onManagerSelectChange()
  {   
   const selected = this.AddUser.get('Manager_User_Id')?.value;  
    this._commonService.GetUserById(selected).subscribe({
      next:res=>{
        if(res.StatusCode==200)
        {
          const email = res.Data.mail_Id;
          this.AddUser.patchValue({
            Manager_Email_Id: email
          })
        }
      }
    })
   
  }
  allowOnlyNumbers(event: KeyboardEvent) {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}
ngOnInit(): void {
  this.BindProcessCategory();
  this.GetRoles();
  this.GetReporting();
  this.GetAccessType();
  this.GetTeamLeader();
  this.GetManager();
  this.GetFunHead();
  const userdetail= this.sessionStorageService.getItem('UserProfile');
  var user = JSON.parse(this._encry.decrypt(userdetail!)); 
  
    this.AddUser=this.fb.group({
      "Name":new FormControl('',Validators.required),
      "Password":new FormControl('',[Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)]),
      "ConPassword":new FormControl('',Validators.required),
      "Mail_Id":new FormControl('',Validators.required),
      "Access_Type_Id":new FormControl('0',Validators.required),
      "IsActive":new FormControl(false,Validators.required),
      "Role_Id":new FormControl('0',Validators.required),
      "EmployeeID":new FormControl('',[Validators.required,Validators.pattern(/^[0-9]+$/)]),
      "TeamLeadUserId":new FormControl(0,Validators.required),
      "TeamLeadEmailId":new FormControl('',Validators.required),
      "Manager_User_Id":new FormControl(0,Validators.required),
      "Manager_Email_Id":new FormControl('',Validators.required),
      "Fun_Manager_User_Id":new FormControl(0,Validators.required),
      "Fun_Manager_Email_Id":new FormControl('',Validators.required),
      "Process_Category":new FormControl('0',Validators.required),
      "Reporting_To":new FormControl(0,Validators.required       
      ),
      "CreatedBy":new FormControl(user.user_Id)
    },{
    validators: this.passwordMatchValidator
  })

  this.AddUser.get('ConPassword')?.valueChanges.subscribe(value => {

      if(this.AddUser.get('ConPassword')?.value != this.AddUser.get('Password')?.value )
      {
        this.ispasswordmatch=true;
        //console.log('Password miss matchedchanged:', value);
      }
      else{
        this.ispasswordmatch=false;
      }
 
});
}
  BindProcessCategory() {
    this._commonService.GetProcessCategory().subscribe({
      next: res => { this.ProcessCategory = res.Data },
      error: err => { console.log(err) }
    })
  }
    GetRoles() {
    this._commonService.GetRoles().subscribe({
      next: res => { this.roles = res.Data },
      error: err => { console.log(err) }
    })
  }
  GetAccessType() {
    this._commonService.GetAccessType().subscribe({
      next: res => { this.accessType = res.Data },
      error: err => { console.log(err) }
    })
  }
    GetTeamLeader() {
    this._commonService.GetTeamLeader().subscribe({
      next: res => { this.teamLead = res.Data },
      error: err => { console.log(err) }
    })
  }
    GetManager() {
    this._commonService.GetMangers().subscribe({
      next: res => { this.Managers = res.Data ;console.log(this.Managers)},
      error: err => { console.log(err) }
    })
  }
    GetFunHead() {
    this._commonService.GetFun_Head().subscribe({
      next: res => { this.fun_head = res.Data },
      error: err => { console.log(err) }
    })
  }
    GetReporting() {
    this._commonService.GetReporting().subscribe({
      next: res => { this.reporting = res.Data },
      error: err => { console.log(err) }
    })
  }
  onInputBlurChange(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  this._commonService.GetUserByEmployeeId(value).subscribe({
      next: res => { //this.reporting = res.Data
        if(res.Data.length>0)
        {
          alert("Employee ID Already  exists");
          this.AddUser.patchValue({
            EmployeeID:null
          })
        }
       },
      error: err => { console.log(err) }
    })
}
onSubmit() {
  if (this.AddUser.invalid) {
    this.AddUser.markAllAsTouched(); // show all errors
    return;
  }

const password=this.AddUser.get('ConPassword')?.value;
const Conpassword=this.AddUser.get('ConPassword')?.value;

if(password != Conpassword)
{
  alert("Password and Confirm Password are not equal");
  return;
}
  

  this._commonService.UserCreate(this.AddUser.value).subscribe({
    next:res=>{ if(res.StatusCode==200)
    {
      alert(res.Data.error_Message);
      this.AddUser.reset();
    }
    },
    error:err=>{console.log(err)}
  })
}


}
