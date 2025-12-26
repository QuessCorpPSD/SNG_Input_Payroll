import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { InvoiceCultureService } from '../../../Service/invoice-culture.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { finalize } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CityService } from '../../../Service/GlobalMasters/City.service';
import { StateComponent } from "../../../common/state/state.component";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { MatCardModule } from "@angular/material/card";
import { State } from '../../../Models/Common';

@Component({
  selector: 'city',
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
    MatTooltipModule, StateComponent, MatCardModule],
  templateUrl: './city.component.html',
  styleUrl: './city.component.css'
})
export class CityComponent {

  isLoading: boolean = false;
  isTableVisible = false;
  excelFile: File | null = null;
  userdetail: any;
  datatable: any;
  stateId?: number;
  stateName: string = "";
  stateUI: any;
  isAddclicked = false;
  Cityform!: FormGroup;
  circle: any;
  showPopup = false;
  popupMessage: string = '';
  searchCityName: any;
  isEditMode: boolean = false;     // tracks add vs edit
  selectedRow: any = null;         // stores the selected city row
  selectedState: any = null;

  displayedColumns: string[] = [
    "delete", "edit", "cityName", "cityCode", "stateName", "saP_Code", "pin_Code"
    , "taluk", "district", "ikya_Location", "circle"
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private cityService: CityService,
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
      state_Id: this.isEditMode ? this.selectedRow.stateId : 0,
      state_Name: this.isEditMode ? this.selectedRow.stateName : ''
    }

    this.Cityform = this.fb.group({
      state: [null],
      City_Code: ['', Validators.required],
      City_Name: ['', Validators.required],
      Tier: ['', Validators.required],
      SAP_Code: [''],
      Pin_Code: ['', Validators.required],
      Taluk: ['', Validators.required],
      District: ['', Validators.required],
      circle: [''],
      ESI_SubCode: ['', Validators.required],
      ESI_SubCode_Name: ['', Validators.required],
      ESIC_Implementation: ['', Validators.required],
      Zone: ['', Validators.required],

    });

  }

  stateEvent(event: any) {
    if (!event) {
      this.stateId = 0;
      this.stateUI = {};
      return;
    }
    this.stateId = event.stateId ?? 0;    // updated to match backend
    this.stateUI = event ?? {};           // the full state object
    console.log('stateUI:', this.stateUI);
    this.BindCircle();
  }

  // stateEvent2(event: State) {
  //   if (!event) {
  //     this.stateId = 0;
  //     this.stateName = '';
  //     this.stateUI = {};
  //     return;
  //   }

  //   this.stateId = event.state_Id;
  //   this.stateName = event.state_Name;
  //   this.stateUI = event;
  //   this.selectedState = event; // keep full object

  //   this.Cityform.get('State')?.setValue(event, { emitEvent: false });

  //   console.log('Selected State:', this.stateUI);
  //   this.BindCircle();
  // }
  stateEvent2(event: State) {
    if (!event) {
      this.stateId = 0;
      this.stateName = '';
      this.stateUI = undefined;
      this.selectedState = undefined;
      this.Cityform.get('State')?.setValue(null);
      return;
    }

    this.stateId = event.state_Id;
    this.stateName = event.state_Name;
    this.stateUI = event;
    this.selectedState = event; // keep full object if needed

    // Set the form control value to the selected state
    this.Cityform.get('State')?.setValue(event);
    console.log('State received in city component:', event);  // In the stateEvent2 method of CityComponent

    console.log('Selected State:', this.stateUI);
    this.BindCircle();
  }



  AddPOOpen() {
    this.isAddclicked = true;
  }

  BindCircle() {
    this.cityService.GetCircle(this.stateId || 0).subscribe({
      next: res => {
        this.circle = res.Data
        console.log(this.circle);

      }
    });
  }

  DeleteClick(row: any) {
    if (!row?.cityID) {
      alert('Invalid City record');
      return;
    }

    if (!confirm(`Are you sure you want to delete city "${row.cityName}"?`)) {
      return;
    }

    const payload = {
      mode: 'Delete',
      createdBy: this.userdetail.user_Id.toString(),
      details: {
        City_Id: row.cityID,
        City_Code: row.cityCode,
        City_Name: row.cityName,

        State_Id: row.stateId,
        State_Name: row.stateName,

        Country: row.country ?? '',
        Country_Id: '',
        Country_Name: '',

        Region_Id: row.regionId ?? 0,
        Region_Name: row.regionName ?? '',

        SAP_Code: row.saP_Code ?? '',
        circle: row.circle ?? '',

        Serial_No: row.serial_No ?? 0,
        Error_Message: '',
        TotalNoofRows: 0,
        Pin_Code: row.pin_Code ?? '',
        Taluk: row.taluk ?? '',
        District: row.district ?? '',
        Ikya_Location: row.ikya_Location ?? '',
        ESI_SubCode: row.esI_SUB_CODE ?? '',
        ESI_SubCode_Name: row.esI_SUB_CODE_NAME ?? '',
        Tier: row.tier ?? '',
        ESIC_Implementation: row.esiC_Implementation ?? '',
        Zone: row.zone ?? ''
      }
    };

    console.log('DELETE CITY PAYLOAD:', JSON.stringify(payload));

    this.isLoading = true;

    this.cityService.PostAddCity(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (res?.StatusCode === 200) {
          alert(res.Data?.[0]?.Error_Message);
          this.SearchClick(); // refresh table
        } else {
          alert(res.Data?.[0]?.Error_Message);
        }
      },
      error: err => {
        this.isLoading = false;
        console.error('Delete City Error:', err);
      }
    });
  }

  EditClick(row: any) {
    this.isAddclicked = true;
    this.isEditMode = true;
    this.selectedRow = row;

    // Prepare the state object
    this.stateUI = {
      state_Id: row.stateId,
      state_Name: row.stateName
    };

    this.stateName = row.stateName;
    this.selectedState = row;  // Full backend object

    // Patch the form with the full data
    this.Cityform.patchValue({
      City_Code: row.cityCode,
      City_Name: row.cityName,
      Tier: row.tier,
      SAP_Code: row.saP_Code,
      Pin_Code: row.pin_Code,
      Taluk: row.taluk,
      District: row.district,
      circle: row.circle ? { ptCircle_Name: row.circle } : null,
      ESI_SubCode: row.esI_SUB_CODE,
      ESI_SubCode_Name: row.esI_SUB_CODE_NAME,
      ESIC_Implementation: row.esiC_Implementation,
      Zone: row.zone,
      state: this.stateUI
    });

    this.Cityform.get('City_Code')?.disable();

    this.BindCircle();
  }



  SearchClick() {

    this.isLoading = true;
    this.isTableVisible = false;

    this.cityService.Search(this.searchCityName?.trim() || "",
      this.stateId || 0,
      0).subscribe({
        next: (res: any) => {
          console.log(res.Data);
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
        }
      });
  }

  closeclick() {
    this.isAddclicked = false;
  }



  SaveData() {
    // if (this.Cityform.invalid) {
    //   this.Cityform.markAllAsTouched();
    //   return;
    // }



    const f = this.Cityform.value;
    const payload = {
      mode: this.isEditMode ? 'Edit' : 'Add',
      createdBy: this.userdetail.user_Id.toString(),
      details: {
        City_Id: this.isEditMode ? this.selectedRow.cityID : 0,
        City_Code: this.isEditMode ? this.selectedRow.cityCode : f.City_Code,
        City_Name: f.City_Name,
        State_Id: this.isEditMode ? this.selectedRow.stateId : this.stateId,
        State_Name: this.isEditMode ? this.selectedRow.stateName : this.stateName ?? '',
        Country: '',
        Country_Id: '',
        Country_Name: '',
        Region_Id: 0,
        Region_Name: '',
        SAP_Code: f.SAP_Code ?? '',
        circle: f.circle ? f.circle.ptCircle_Name : '',
        Serial_No: 0,
        Error_Message: '',
        TotalNoofRows: 0,
        Pin_Code: f.Pin_Code ?? '',
        Taluk: f.Taluk ?? '',
        District: f.District ?? '',
        Ikya_Location: '',
        ESI_SubCode: f.ESI_SubCode ?? 0,
        ESI_SubCode_Name: f.ESI_SubCode_Name ?? '',
        Tier: f.Tier ?? '',
        ESIC_Implementation: f.ESIC_Implementation ?? '',
        Zone: f.Zone ?? ''
      }
    };


    console.log('FINAL CITY PAYLOAD:', JSON.stringify(payload));

    this.isLoading = true;

    this.cityService.PostAddCity(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (res?.StatusCode === 200) {
          // alert(mode === 'Add' ? 'City Added Successfully' : 'City Updated Successfully');
          alert(res.Data?.[0]?.Error_Message)
          this.isAddclicked = false;
          this.Cityform.reset();
          this.isEditMode = false;
          this.SearchClick();
        } else {
          alert(res.Data?.[0]?.Error_Message || 'Failed to save city');
        }
      },
      error: err => {
        this.isLoading = false;
        console.error('Save City Error:', err);
      }
    });
  }
}
