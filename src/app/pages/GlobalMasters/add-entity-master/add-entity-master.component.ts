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
          alert("No legal entity records found");
          return;
        }

        this.quessLegalEntityList = table.map(x => ({
          id: x.QuessLegalEntityId,
          name: x.QuessLegalEntityName
        }));
      },
      error: () => {
        this.isLoading = false;
        alert("Failed to load legal entity dropdown");
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.entityForm.invalid) {
      console.warn("❌ Form invalid:", this.entityForm.value);
      this.entityForm.markAllAsTouched();
      return;
    }

    const f = this.entityForm.value;
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
        City_Id: Number(f.ProfitCenter) || 76,
        City_Name: "",
        Location: "Singapore",
        Error_Message: "",
        Serial_No: 1
      }
    };
    this.entityService.CreateEntity(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const msg = res?.Data?.message || "";
        const code = res?.Data?.statusCode;

        if ((res?.StatusCode === 200 && msg) || code === "400") {
          alert(msg || "Entity saved");
          this.dialogRef.close(true);

        } else {
          console.warn("⚠️ Success condition FAILED");
          alert("Save failed");
        }
      },

      error: (err) => {
        this.isLoading = false;
        console.error("❌ API ERROR:", err);
        alert("API Error");
      }
    });
  }
}
