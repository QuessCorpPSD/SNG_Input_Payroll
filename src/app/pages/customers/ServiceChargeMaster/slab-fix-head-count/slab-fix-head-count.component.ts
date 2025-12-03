import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-slab-fix-head-count',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './slab-fix-head-count.component.html',
  styleUrl: './slab-fix-head-count.component.css'
})
export class SlabFixHeadCountComponent {

  headCountForm!: FormGroup;
  showErrors = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SlabFixHeadCountComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.headCountForm = this.fb.group({
      mapName: ['', Validators.required],
      isMapNameRequired: ['', Validators.required],
      slab: ['', Validators.required],
      value: ['', Validators.required],
      startDate: ['', Validators.required]
    });
  }

  onSubmit() {
    this.showErrors = true;

    if (this.headCountForm.invalid) {
      return; // stop and show errors
    }

    console.log("Slab Fix HeadCount Submitted:", this.headCountForm.value);
    this.dialogRef.close(this.headCountForm.value);
  }

  onReset() {
    this.headCountForm.reset();
    this.showErrors = false;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
