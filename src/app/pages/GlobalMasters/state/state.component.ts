import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatCardModule } from "@angular/material/card";
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CityService } from '../../../Service/GlobalMasters/City.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { IStateRepository } from '../../../Repository/GlobalMasters/IState.service';
import { StatesService } from '../../../Service/GlobalMasters/states.service';
export const Pay_TOKEN = new InjectionToken<IStateRepository>('Pay_TOKEN');

@Component({
  selector: 'app-state',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule, MatCardModule],
  templateUrl: './state.component.html',
  styleUrl: './state.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: StatesService,
    }
  ]
})
export class StatesComponent {
  isLoading: boolean = false;
  isTableVisible = false;
  excelFile: File | null = null;
  userdetail: any;
  datatable: any;
  stateId?: number;
  stateName: string = "";
  stateUI: any;
  isAddclicked = false;
  stateform!: FormGroup;
  isEditMode = false;
  selectedRow: any = null;
  region: any;
  regions: any;
  showPopup = false;
  popupMessage: string = '';
  searchCityName: any;
  displayedColumns: string[] = [
    "delete",
    "edit",
    "serial_No",
    "StateCode",
    "stateName",
    "country",
    "regionName",
    "saP_Code",
    "min_labor_count",
    "Security_Deposit"
  ];

  dataSource = new MatTableDataSource<any>([]);





  // dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    @Inject(Pay_TOKEN) private service: IStateRepository,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {

    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));

    this.stateUI = {
      state_Id: 0,
      state_Name: ''
    }

    this.stateform = this.fb.group({
      State_Code: ['', Validators.required],
      State_Name: ['', Validators.required],
      Country: ['', Validators.required],
      Region: ['', Validators.required],
      SAP_Code: [''],
      Min_Labor_Count: ['', Validators.required],
      Security_Deposit: ['']
    });
    this.BindRegion();
  }


  AddPOOpen() {
    this.isAddclicked = true;
    this.isEditMode = false;
    this.selectedRow = null;
    this.stateform.reset();

    // Enable State Code for ADD
    this.stateform.get('State_Code')?.enable();
  }

  BindRegion() {
    this.service.GetRegion().subscribe({
      next: res => {
        this.region = res.Data
        console.log(this.region);

      }
    });
  }

  DeleteState(row: any) {
    if (!row || !row.stateId) {
      alert("Invalid state selected for deletion");
      return;
    }

    const payload = {
      createdBy: this.userdetail.user_Id.toString(),
      mode: "Delete",
      details: {
        State_Id: row.stateId,
        State_Code: row.stateCode,
        State_Name: row.stateName,
        Country: row.country ?? '',
        Region_Id: row.regionId ?? 0,
        SAP_Code: row.sapCode ?? 0,
        Min_Labor_Count: row.minLaborCount ?? 0,
        Security_Deposit: row.securityDeposit ?? 0
      }
    };

    console.log("DELETE PAYLOAD:", JSON.stringify(payload));

    this.isLoading = true;

    this.service.PostAddState(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.StatusCode === 200) {
          alert(res.Data[0].Error_Message);
          // Refresh the table after delete
          this.SearchClick();
        } else {
          alert(res.Data[0].Error_Message);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Delete State Error:", err);
      }
    });
  }


  editState(row: any) {
    this.isAddclicked = true;
    this.isEditMode = true;
    this.selectedRow = row;

    this.stateform.patchValue({
      State_Code: row.stateCode,
      State_Name: row.stateName,
      Country: row.country,
      Region: row.regionId,
      SAP_Code: row.sapCode,
      Min_Labor_Count: row.min_Labor_Count,
      Security_Deposit: row.security_Deposit
    });

    // Disable State Code during edit
    this.stateform.get('State_Code')?.disable();
  }




  SearchClick() {
    this.isLoading = true;
    this.isTableVisible = false;
    console.log('region', this.regions)
    this.service.SearchCity(
      this.searchCityName?.trim() || "",
      this.regions || 0,
      this.stateId || 0
    ).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (res.StatusCode === 200 && Array.isArray(res.Data) && res.Data.length > 0) {
          this.dataSource.data = res.Data;
          this.isTableVisible = true;

          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        } else {
          this.dataSource.data = [];
          this.isTableVisible = false;
          alert("No Records Found");
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.isTableVisible = false;
        console.error("API Error:", err);
        this.dataSource.data = [];
        alert("Error fetching data. Please try again.");
      }
    });
  }

  exportToExcel(): void {




    this.isLoading = true;

    this.service.SearchCity(
      this.searchCityName?.trim() || "",
      this.regions || 0,
      this.stateId || 0
    ).subscribe({
      next: (res) => {
        this.isLoading = false;

        const data = res.Data || [];

        if (!data || data.length === 0) {
          alert("No data available to export");
          this.isLoading = false;
          return;
        }
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "StateMaster");
        const fileName = `Statemaster_${new Date().toISOString().split("T")[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
      },

      error: () => {
        this.isLoading = false;
        alert("Failed to export data");
      }
    });
  }

  closeclick() {
    this.isAddclicked = false;
  }

  SaveData() {
    if (this.stateform.invalid) {
      this.stateform.markAllAsTouched();
      return;
    }

    const f = this.stateform.value;

    const mode = this.isEditMode ? "Edit" : "Add";
    // console.log('edit', this.selectedRow.stateId, this.selectedRow.stateCode)
    const payload = {
      createdBy: this.userdetail.user_Id.toString(),
      mode: mode,
      details: {
        State_Id: this.isEditMode ? this.selectedRow.stateId : 0,
        State_Code: this.isEditMode ? this.selectedRow.stateCode : f.State_Code,
        State_Name: f.State_Name,
        Country: f.Country,
        Region_Id: this.isEditMode ? this.selectedRow.regionId : f.Region,
        SAP_Code: f.SAP_Code ?? null,
        Min_Labor_Count: f.Min_Labor_Count ?? 0,
        Security_Deposit: f.Security_Deposit ?? 0
      }
    };

    console.log('FINAL PAYLOAD:', JSON.stringify(payload));

    this.isLoading = true;

    this.service.PostAddState(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.StatusCode === 200) {
          // alert(`State ${mode === 'Add' ? 'Added' : 'Updated'} Successfully`);
          alert(res.Data[0].Error_Message);
          this.isAddclicked = false;
          this.stateform.reset();
          this.SearchClick();
          this.isEditMode = false;
        } else {
          // alert(`Failed to ${mode === 'Add' ? 'add' : 'update'} state`);
          alert(res.Data[0].Error_Message);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Save State Error:', err);
      }
    });
  }

}


