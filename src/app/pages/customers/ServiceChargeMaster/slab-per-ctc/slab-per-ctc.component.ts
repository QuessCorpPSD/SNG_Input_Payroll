import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-slab-per-ctc',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './slab-per-ctc.component.html',
  styleUrl: './slab-per-ctc.component.css'
})
export class SlabPerCTCComponent {

  ctcForm!: FormGroup;
  showErrors = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SlabPerCTCComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.ctcForm = this.fb.group({
      mapName: ['', Validators.required],
      value: ['', Validators.required],
      prorate: ['', Validators.required],

      ffProrate: ['', Validators.required],
      ffArrearProrate: ['', Validators.required],
      newJoineeProrate: ['', Validators.required],

      newJoineeArrearProrate: ['', Validators.required],
      startDate: ['', Validators.required],
      complianceFee: ['', Validators.required],

      randstadFee: ['', Validators.required],
      upfrontFeeType: ['', Validators.required]
    });
  }

  onSubmit() {
    this.showErrors = true;

    if (this.ctcForm.invalid) return;

    console.log("Slab Percentage CTC Submitted:", this.ctcForm.value);
    this.dialogRef.close(this.ctcForm.value);
  }

  onReset() {
    this.ctcForm.reset();
    this.showErrors = false;
  }

  onClose() {
    this.dialogRef.close();
  }
}
