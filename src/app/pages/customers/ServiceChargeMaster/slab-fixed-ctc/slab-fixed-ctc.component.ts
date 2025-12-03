import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-slab-fixed-ctc',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './slab-fixed-ctc.component.html',
  styleUrl: './slab-fixed-ctc.component.css'
})
export class SlabFixedCTCComponent {

  ctcForm!: FormGroup;
  showErrors = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SlabFixedCTCComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.ctcForm = this.fb.group({
      mapName: ['', Validators.required],
      type: ['', Validators.required],
      paycode: ['', Validators.required],

      fromValue: ['', Validators.required],
      toValue: ['', Validators.required],
      value: ['', Validators.required],

      capValue: ['', Validators.required],
      prorate: ['', Validators.required],
      startDate: ['', Validators.required],

      slabCalcType: ['', Validators.required]
    });
  }

  onSubmit() {
    this.showErrors = true;

    if (this.ctcForm.invalid) {
      return;
    }

    console.log("Slab Fixed CTC Submitted:", this.ctcForm.value);
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
