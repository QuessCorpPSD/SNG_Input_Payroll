import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css'
})
export class ForgotComponent implements OnInit{
  forgotForm!:FormGroup

  password: boolean=false;
  constructor(private fb:FormBuilder){
   this.forgotForm= this.fb.group({
      "Password":new  FormControl('',Validators.required),
      "ConfirmPassword":new  FormControl('',Validators.required)
    });
  }
  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('Password')?.value;
    const confirmPassword = form.get('ConfirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  ngOnInit(): void {
    


    this.forgotForm.get('ConfirmPassword')?.valueChanges.subscribe(value => {

      if(this.forgotForm.get('ConfirmPassword')?.value != this.forgotForm.get('Password')?.value )
      {
        this.password=true;
        //console.log('Password miss matchedchanged:', value);
      }
      else{
        this.password=false;
      }
 
});
  }
 
  forgotpassword() {
     this.forgotForm.get('Password')?.valueChanges.subscribe(value => {
  console.log('Password changed:', value);
});
  }



}
