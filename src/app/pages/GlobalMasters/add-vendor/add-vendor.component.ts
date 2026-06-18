import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VendorMasterService } from '../../../Service/GlobalMasters/vendor-master.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';

@Component({
  selector: 'app-add-vendor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    AlertpopupComponent
  ],
  templateUrl: './add-vendor.component.html',
  styleUrl: './add-vendor.component.css',

})
export class AddVendorComponent {

  VendorForm!: FormGroup;

  showErrors: boolean = false;   // <-- ✅ REQUIRED (Fixes the Template Error)

  // popup handling
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  isLoading: boolean = false;
  isEditMode: boolean = false;
  editingRowId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddVendorComponent>,
    private VendorService: VendorMasterService,
    private session: SessionStorageService,
    private decrypt: EncryptionService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
  ) { }

  ngOnInit(): void {
    this.VendorForm = this.fb.group({
      VendorName: ['', Validators.required],
      VendorCode: [{ value: '', disabled: true }]
    });
    if (this.editData?.mode?.toLowerCase() === 'edit') {
      this.isEditMode = true;
      this.patchEditData();
    }
  }

  patchEditData() {
    const row = this.editData.row;
    // PATCH FORM VALUES
    this.VendorForm.patchValue({
      VendorName: row.Client_Name,
      VendorCode: row.Client_Code,
    });
  }

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
    this.isEditMode = false;
  }

  onSave() {

    this.showErrors = true;   // <-- ensures validation shows in UI

    if (this.VendorForm.invalid) {
      this.VendorForm.markAllAsTouched();
      return;
    }

    const f = this.VendorForm.value;

    const payload = {
      createdBy: 3,
      mode: this.isEditMode ? "Edit" : "Add",
      detail: {
        Client_Id: this.isEditMode ? this.editData.row.Client_Id : 0,
        Client_Code: f.VendorCode || "",
        Client_Name: f.VendorName?.trim()
      }
    };

    this.isLoading = true;

    this.VendorService.CreateVendor(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        const message =
          res?.Data?.data?.Table0?.[0]?.Error_Message ||
          res?.Data?.message ||
          "Success";

        if (res?.StatusCode === 200) {

          alert(message);

          setTimeout(() => {
            this.closePopup();
            this.dialogRef.close('updated');
          }, 900);

        } else {
          alert("Save failed");
        }
      },

      error: (err) => {
        this.isLoading = false;
        alert("API Error");
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}

