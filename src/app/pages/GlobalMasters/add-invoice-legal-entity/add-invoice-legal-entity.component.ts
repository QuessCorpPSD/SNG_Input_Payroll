import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { InvoiceLegalEntityService } from '../../../Service/GlobalMasters/invoice-legal-entity.service';


@Component({
  selector: 'app-add-invoice-legal-entity',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatDialogModule,
    ReactiveFormsModule,
    AlertpopupComponent
  ],
  templateUrl: './add-invoice-legal-entity.component.html',
  styleUrls: ['./add-invoice-legal-entity.component.css']
})
export class AddInvoiceLegalEntityComponent {

  entityForm!: FormGroup;

  // ✔ Popup + Loader
  showPopup = false;
  popupMessage = '';
  popupSubMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddInvoiceLegalEntityComponent>,
    private entityService: InvoiceLegalEntityService
  ) { }

  ngOnInit(): void {
    this.entityForm = this.fb.group({
      EntityName: ['', Validators.required]
    });
  }

  // ✔ Popup Function
  showAlertPopup(msg: string, subMsg: string = '') {
    this.popupMessage = msg;
    this.popupSubMessage = subMsg;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  onClose() {
    this.dialogRef.close();
  }

  
  onSave(): void {

    if (this.entityForm.invalid) {
      this.entityForm.markAllAsTouched();
      return;
    }

    const entityName = this.entityForm.value.EntityName.trim();

    this.isLoading = true;

    const payload = {
      createdBy: 3,
      mode: "Add",
      parentDetail: {
        Id: 1,
        EntityName: entityName,
        Serial_No: 1,
        Error_Message: ""
      }
    };

    this.entityService.CreateInvoice(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        const msg = res?.Data?.data?.Table0?.[0]?.Error_Message || "";

        if (msg) {
          // ✔ Instead of alert(msg)
          this.showAlertPopup(msg);

          // close dialog slightly delayed
          setTimeout(() => {
            this.closePopup();
            this.dialogRef.close(true);
          }, 900);

        } else {
          // ✔ Instead of alert("Save failed")
          this.showAlertPopup("Save failed");
        }
      },

      error: () => {
        this.isLoading = false;
        this.showAlertPopup("Error", "API Error");
      }
    });
  }

}
