import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EntityMasterService } from '../../../Service/GlobalMasters/entity-master.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';

@Component({
  selector: 'app-add-entity-master',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatCardModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
    AlertpopupComponent
  ],
  templateUrl: './add-entity-master.component.html',
  styleUrls: ['./add-entity-master.component.css']
})
export class AddEntityMasterComponent {

  entityForm!: FormGroup;

  quessLegalEntityList: any[] = [];

  isLoading: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';

  constructor(
    private dialogRef: MatDialogRef<AddEntityMasterComponent>,
    private fb: FormBuilder,
    private entityService: EntityMasterService
  ) { }

  ngOnInit(): void {
    this.entityForm = this.fb.group({
      EntityName: ['', Validators.required],
      FunctionCode: ['', Validators.required],
      WBS: [''],

      // ✔ FIXED — removed required validator
      ProfitCenter: [''],

      AccountNumber: [''],
      QuessLegalEntityId: ['', Validators.required],
      EstablishmentCode: ['']
    });

    this.bindQuessLegalEntity();
  }

  // ============================
  // ALERT POPUP
  // ============================
  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  // ============================
  // LOAD DROPDOWN
  // ============================
  bindQuessLegalEntity() {
    this.isLoading = true;

    this.entityService.GetQuessLegalEntity().subscribe({
      next: res => {
        this.isLoading = false;

        const table = res?.Data?.data?.Table0 || [];

        if (!table.length) {
          this.showAlertPopup("No legal entity records found");
          return;
        }

        this.quessLegalEntityList = table.map(x => ({
          id: x.QuessLegalEntityId,
          name: x.QuessLegalEntityName
        }));
      },
      error: () => {
        this.isLoading = false;
        this.showAlertPopup("Failed to load legal entity dropdown");
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {

    console.log("➡️ Save button clicked");

    if (this.entityForm.invalid) {
      console.warn("❌ Form invalid:", this.entityForm.value);
      this.entityForm.markAllAsTouched();
      return;
    }

    const f = this.entityForm.value;
    console.log("📝 FORM VALUES:", f);

    this.isLoading = true;

    const payload = {
      createdBy: 3,
      mode: "Add",
      parentDetail: {
        Entity_Id: 0,
        Entity_Name: f.EntityName?.trim(),
        Function_Code: f.FunctionCode,
        WBS: f.WBS || "",
        Profit_Center: f.ProfitCenter || "",
        Account_Number: f.AccountNumber || "",
        QuessLegalEntityId: Number(f.QuessLegalEntityId),
        QuessLegalEntityName:
          this.quessLegalEntityList.find(x => x.id == f.QuessLegalEntityId)?.name || "",
        EstablishmentCode: f.EstablishmentCode || ""
      },
      ChildDetail: {
        Entity_Profit_Center_Id: 0,
        Entity_Id: 0,
        Entity_Name: f.EntityName?.trim(),
        City_Id: Number(f.ProfitCenter) || 0,
        City_Name: "",
        Location: "",
        Error_Message: "",
        Serial_No: 1
      }
    };

    console.log("📦 FINAL PAYLOAD SENT:", payload);
    console.log("📡 Sending API request...");

    this.entityService.CreateEntity(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        console.log("✅ API RESPONSE RECEIVED:", res);

        const msg = res?.Data?.message || "";
        const code = res?.Data?.statusCode;

        console.log("🔍 Extracted message:", msg);
        console.log("🔍 Extracted statusCode:", code);
        console.log("🔍 Top level StatusCode:", res?.StatusCode);

        if ((res?.StatusCode === 200 && msg) || code === "400") {

          console.log("🎉 SUCCESS CONDITION PASSED");

          this.showAlertPopup(msg || "Entity saved");

          setTimeout(() => {
            console.log("🔒 Closing popup + dialog");
            this.closePopup();
            this.dialogRef.close(true);
          }, 900);

        } else {
          console.warn("⚠️ Success condition FAILED");
          this.showAlertPopup("Save failed");
        }
      },

      error: (err) => {
        this.isLoading = false;
        console.error("❌ API ERROR:", err);
        this.showAlertPopup("Error", "API Error");
      }
    });
  }
}
