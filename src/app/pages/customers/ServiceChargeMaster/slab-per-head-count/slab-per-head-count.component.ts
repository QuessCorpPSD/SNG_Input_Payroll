import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-slab-per-head-count',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './slab-per-head-count.component.html',
  styleUrl: './slab-per-head-count.component.css'
})
export class SlabPerHeadCountComponent {

  slabPerHeadForm!: FormGroup;
  showErrors = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SlabPerHeadCountComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.slabPerHeadForm = this.fb.group({
      mapName: ['', Validators.required],
      isMapNameRequired: ['', Validators.required],
      slab: ['', Validators.required],
      value: ['', Validators.required],
      startDate: ['', Validators.required]
    });
  }

  onSubmit() {
    this.showErrors = true;

    if (this.slabPerHeadForm.invalid) {
      return; // show error and stop
    }

    console.log("Slab Percentage Head Count Submitted:", this.slabPerHeadForm.value);
    this.dialogRef.close(this.slabPerHeadForm.value);
  }

  onReset() {
    this.slabPerHeadForm.reset();
    this.showErrors = false;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
