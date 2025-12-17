import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SDLslabDetailsService } from '../../../Service/GlobalMasters/sdlslab-details.service';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

@Component({
  selector: 'app-addsdlslab-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatDialogModule,
    ReactiveFormsModule,
    AlertpopupComponent
  ],
  templateUrl: './addsdlslab-detail.component.html',
  styleUrls: ['./addsdlslab-detail.component.css']
})
export class ADDSDLslabDetailComponent {
  Addslab!: FormGroup;
  payCodeList: any[] = [];
  CriteriaList: any[] = [];
  isLoading = false;

  dataSource = new MatTableDataSource<any>([]);
  uploadedData: any[] = [];
  uploadedDataSource = new MatTableDataSource(this.uploadedData);
  userdetail: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialogRef: MatDialogRef<ADDSDLslabDetailComponent>,
    private fb: FormBuilder,
    private sdlService: SDLslabDetailsService,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService
  ) { }

  ngOnInit(): void {

    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    else {
      console.warn('UserProfile not found in the session Storage');
    }
    this.Addslab = this.fb.group({
      PayCodeId: ['', Validators.required],

      // Description disabled & no validation
      Description: [{ value: '', disabled: true }],

      From_Value: ['', Validators.required],
      To_Value: ['', Validators.required],
      Criteria_Type_Id: ['', Validators.required],
      Criteria: ['', Validators.required],
      Min_Value: ['', Validators.required],
      Max_Value: ['', Validators.required]
    });

    this.loadPayCodes();
    this.loadCriteriaTypes();

    // Ensure remains disabled
    this.Addslab.get('Description')?.disable();
  }

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }
  loadPayCodes(): void {
    this.sdlService.GetPayCodeList().subscribe({
      next: (res: any) => {
        if (res?.StatusCode === 200 && res?.Message === 'Success') {
          const tableData = res?.Data?.data?.Table0;

          if (Array.isArray(tableData) && tableData.length > 0) {
            this.payCodeList = tableData;
          } else {
            this.payCodeList = [];
            console.warn('No PayCode records found in Table0.');
          }
        } else {
          this.payCodeList = [];
          console.warn('Unexpected PayCode API response format.');
        }
      },
      error: (err) => {
        console.error('PayCode API Error:', err);
        this.payCodeList = [];
      }
    });
  }

  loadCriteriaTypes(): void {
    this.sdlService.GetCriteriaType().subscribe({
      next: (res: any) => {
        if (Array.isArray(res?.Data?.data?.Table0)) {
          this.CriteriaList = res.Data.data.Table0;
        } else if (Array.isArray(res?.Data?.data)) {
          this.CriteriaList = res.Data.data;
        } else {
          this.CriteriaList = [];
          console.warn('No valid criteria data found.');
        }
      },
      error: (err) => {
        console.error('Error loading Criteria types:', err);
        this.CriteriaList = [];
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {

    this.Addslab.markAllAsTouched();

    if (this.Addslab.invalid) {
      return; // ❌ no alert popup
    }

    const formValue = this.Addslab.getRawValue();

    const xmlDetails = `
<Root>
  <Row
    PayCode="${formValue.PayCodeId || ''}"
    Description="${formValue.Description || ''}"
    From_Value="${formValue.From_Value || 0}"
    To_Value="${formValue.To_Value || 0}"
    Criteria_Type_Id="${formValue.Criteria_Type_Id || 0}"
    Criteria="${formValue.Criteria || ''}"
    Min_Value="${formValue.Min_Value || 0}"
    Max_Value="${formValue.Max_Value || 0}"
  />
</Root>
  `.trim();

    const payload = {
      strXmlDetails: xmlDetails,
      mode: 'Add',
      userId: this.userdetail.user_Id
    };

    this.sdlService.CreateSDL(payload).subscribe({
      next: (res: any) => {
        if (res?.StatusCode === 200 && res?.Data?.statusCode === "200") {
          alert('SDL record created successfully');
          this.dialogRef.close();
        } else {
          alert(res?.Data?.message || 'SDL creation failed.');
        }
      },
      error: (err) => {
        console.error('Error creating SDL record:', err);
        alert('Error occurred while saving.');
      }
    });
  }

}
