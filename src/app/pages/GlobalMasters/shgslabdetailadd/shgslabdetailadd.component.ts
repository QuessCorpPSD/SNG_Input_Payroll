import { CommonModule } from '@angular/common';
import { Component, InjectionToken, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ISHGService } from '../../../Repository/GlobalMasters/IShg.service';
import { ShgserviceService } from '../../../Service/GlobalMasters/shgservice.service';

export const SHG_TOKEN = new InjectionToken<ISHGService>('SHG_TOKEN');


@Component({
  selector: 'app-shgslabdetailadd',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './shgslabdetailadd.component.html',
  styleUrl: './shgslabdetailadd.component.css',
  providers: [{
    provide: SHG_TOKEN,
    useClass: ShgserviceService
  }]
})
export class ShgslabdetailaddComponent {
  addshgform!: FormGroup
  category: any;
  constructor(@Inject(SHG_TOKEN) private shg: ShgserviceService, private dialogRef: MatDialogRef<ShgslabdetailaddComponent>) { }

  ngOnInit(): void {
    this.BindGetCategory();
    this.addshgform = new FormGroup({
      EffectiveDate: new FormControl('', Validators.required),
      Category: new FormControl('', Validators.required),
      IncomeFrom: new FormControl('', Validators.required),
      IncomeTo: new FormControl('', Validators.required),
      Value: new FormControl('', Validators.required),
    });
  }

  BindGetCategory() {
    this.shg.getCategory().subscribe({
      next: res => { this.category = res.Data.data }
    });
  }

  onSaveSHG(): void {
    console.log(' Save SHG button clicked');

    // Step 1: Validate form
    if (this.addshgform.invalid) {
      console.warn('Form invalid. Please enter all required fields.');
      this.addshgform.markAllAsTouched();
      alert("Please enter all required fields.")
      return;
    }

    //  Step 2: Get form values
    const formValue = this.addshgform.getRawValue();

    //  Step 3: Build XML string
    const xmlDetails = `
<Root>
  <Row
    EffectiveDate="${formValue.EffectiveDate || ''}"
    Category="${formValue.Category || ''}"
    Income_From="${formValue.IncomeFrom || 0}"
    Income_To="${formValue.IncomeTo || 0}"
    Value="${formValue.Value || 0}"
  />
</Root>
`.trim();

    // Step 4: Prepare final payload
    const payload = {
      strXmlDetails: xmlDetails,
      mode: 'Add',
      userId: 3
    };

        //  Step 5: Call API
    this.shg.createShg(payload).subscribe({
      next: (res: any) => {
        if (res?.StatusCode === 200 && res?.Data?.statusCode === '200') {
          //  Success Case
          alert("SHG Slab Detail record created successfully")
          this.dialogRef?.close();
        } else {
          //  Failure Case
          const message =
            res?.Data?.message ||
            res?.Message ||
            'SHG creation failed. Please try again.';
          alert(message);
        }
      },
      error: (err) => {
        alert('Something went wrong while saving SHG.');
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }

}
