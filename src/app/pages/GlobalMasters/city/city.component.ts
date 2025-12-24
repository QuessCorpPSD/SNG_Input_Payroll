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
      state_Id: 0,
      state_Name: ''
    }

    this.Cityform = this.fb.group({
      State: [null],
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
      Zone: ['', Validators.required]
    });
  }

  stateEvent(event: any) {
    if (!event) {
      this.stateId = 0;
      this.stateUI = {};
      return;
    }
    this.stateId = event.state_Id ?? 0;
    this.stateUI = event.State ?? {};

    console.log(this.stateUI);
  }

  stateEvent2(event: any) {
    if (!event) {
      this.stateId = 0;
      this.stateName = '';
      this.stateUI = {};
      return;
    }
    this.stateId = event.state_Id ?? 0;
    this.stateName = event.state_Name ?? 0;
    this.stateUI = event.State ?? {};
    console.log(this.stateUI);
  }

  AddPOOpen() {
    this.BindCircle();
    this.isAddclicked = true;
  }

  BindCircle() {
    this.cityService.GetCircle(this.stateId || 0).subscribe({
      next: res => { this.circle = res.Data }
    });
    console.log(this.circle);
  }

  DeleteClick() {

  }

  EditClick() {

  }

  SearchClick(cityName: string) {

    this.isLoading = true;
    this.isTableVisible = false;

    this.cityService.Search(cityName, this.stateId || 0, 0).subscribe({
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
    if (this.Cityform.invalid) {
      this.Cityform.markAllAsTouched();
      return;
    }
    const formValue = this.Cityform.value;

    const details = {
      City_Code: formValue.City_Code.text,
      City_Name: formValue.City_Name.text,
      State_Id: this.stateId,
      State_Name: this.stateName,
      SAP_Code: formValue.SAP_Code.text,
      Pin_Code: formValue.Pin_Code.text,
      Taluk: formValue.Taluk.text,
      District: formValue.District.text,
      circle: formValue.circle.text,
      ESI_SubCode: formValue.ESI_SubCode.text,
      ESI_SubCode_Name: formValue.ESI_SubCode_Name.text,
      ESIC_Implementation: formValue.ESIC_Implementation.text,
      Zone: formValue.Zone.text
    }

    const CityAddRequest = {
      mode: 'Add',
      createdBy: String(this.userdetail.user_Id),
      details: details
    };

    this.cityService.PostAddCity(CityAddRequest).subscribe({
      next: (res) => {
        const errormsg = res.Data[0].msg;

        if (errormsg === 'false') {
          this.isAddclicked = false;
          this.showPopup = true;
          this.popupMessage = "City Added Successfully";
        }
        else {
          alert("City already availabe for this company");
          this.Cityform.reset({
            City_Code: '',
            City_Name: '',
            SAP_Code: '',
            Pin_Code: '',
            Taluk: '',
            District: '',
            circle: '',
            ESI_SubCode: '',
            ESI_SubCode_Name: '',
            ESIC_Implementation: '',
            Zone: ''
          });
          this.isLoading = false;

        }
        error: (err) => {
          console.error("Error saving:", err);
        }
      }
    });
  }

}
