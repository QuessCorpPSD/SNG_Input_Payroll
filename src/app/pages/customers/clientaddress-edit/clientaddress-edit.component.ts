import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";

@Component({
  selector: 'app-clientaddress-edit',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule, CompanyallComponent],
  templateUrl: './clientaddress-edit.component.html',
  styleUrl: './clientaddress-edit.component.css'
})
export class ClientaddressEditComponent {
  clientaddress!: FormGroup;
  sameAsBilling = false;
  submitted = false;

  constructor(
    private dialogRef: MatDialogRef<ClientaddressEditComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.clientaddress = this.fb.group({
      company: ['', Validators.required],
      Costcentermapping: [''],

      subCustomerCode: ['', Validators.required],
      gstNumber: [''],

      billingClientName: ['', Validators.required],
      billingAddress: ['', Validators.required],

      shippingClientName: ['', Validators.required],
      shippingAddress: ['', Validators.required],

      effectiveDate: [''],
      gstApplicable: [false]
    });
  }

  // When company dropdown emits
  handleCompanyEvent(company: any) {
    this.clientaddress.patchValue({
      company: company.companyCode
    });
  }

  // Mark single field touched
  markFieldTouched(field: string) {
    this.clientaddress.get(field)?.markAsTouched();
  }

  // Same as billing checkbox
  onSameAsBillingChange(event: any) {
    this.sameAsBilling = event.target.checked;

    if (this.sameAsBilling) {
      this.clientaddress.patchValue({
        shippingClientName: this.clientaddress.value.billingClientName,
        shippingAddress: this.clientaddress.value.billingAddress
      });
      this.clientaddress.get('shippingClientName')?.disable();
      this.clientaddress.get('shippingAddress')?.disable();
    } else {
      this.clientaddress.get('shippingClientName')?.enable();
      this.clientaddress.get('shippingAddress')?.enable();
      this.clientaddress.patchValue({
        shippingClientName: '',
        shippingAddress: ''
      });
    }
  }

  // Submit button
  onSubmit() {
    this.submitted = true;

    if (this.clientaddress.invalid) {
      this.clientaddress.markAllAsTouched();
      return;
    }

    console.log("Form submitted:", this.clientaddress.value);
  }

  onClose() {
    this.dialogRef.close();
  }
}
