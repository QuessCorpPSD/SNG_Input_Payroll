import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ClientaddressNewComponent } from '../clientaddress-new/clientaddress-new.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientaddressImportComponent } from '../clientaddress-import/clientaddress-import.component';
import { ClientaddressEditComponent } from '../clientaddress-edit/clientaddress-edit.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { ClientaddressService } from '../../../Service/customersserv/clientaddress.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-clientaddress',
  standalone: true,
  imports: [MatPaginatorModule, MatTableModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule, AlertpopupComponent],
  templateUrl: './clientaddress.component.html',
  styleUrl: './clientaddress.component.css'
})
export class ClientaddressComponent {
  Clientaddress: any;
  userdetail: any;
  constructor(private dialog: MatDialog, private service: ClientaddressService, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService) { }
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  showAlert = false;
  showValidate = false;
  isLoading: boolean = false;
  uploadDisplayedColumns: string[] = [
    'Client_Address_Id', 'Companycode', 'MapName', 'SAPCustomercode', 'Billing_Client_Name', 'billingaddress', 'Shippingaddresssameasbilling', 'Shippingclientname', 'Shippingaddress', 'Effectivedate', 'gstnumber', 'gstapplicable'];

  dataSource = new MatTableDataSource<any>();
  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;


  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }

    this.onsearch();
  }

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showAlert = true;
    this.showValidate = false;
  }

  showvalidatePopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showValidate = true;
    this.showAlert = false;
  }

  closePopup() {
    this.showAlert = false;
    this.showValidate = false;
  }



  AddPOOpen() {
    this.dialog.open(ClientaddressNewComponent, {
      width: '60%',
      height: '85vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

  ImportOpen() {
    this.dialog.open(ClientaddressImportComponent, {
      width: '60%',
      height: '78vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }
  editOpen() {
    this.dialog.open(ClientaddressEditComponent, {
      width: '60%',
      height: '85vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

  onsearch() {
    this.isLoading = true;

    const userId = this.userdetail.user_Id;

    this.service.Search(userId).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.Clientaddress = res?.Data;

        if (!this.Clientaddress) {
          this.isLoading = false;
          alert(res.Data.message)
        }
        if (this.Clientaddress && this.Clientaddress.length > 0) {
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(this.Clientaddress);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.uploadDisplayedColumns = [
            'Client_Address_Id', 'Companycode', 'MapName', 'SAPCustomercode', 'Billing_Client_Name', 'billingaddress', 'Shippingaddresssameasbilling', 'Shippingclientname', 'Shippingaddress', 'Effectivedate', 'gstnumber', 'gstapplicable'];

        } else {
          this.isLoading = false;
          this.dataSource.data = [];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading Companypaycode release data', err);
      },
    });
    this.isLoading = false;
  }


  exportToExcel(): void {
    this.isLoading = true;

    const Companyid = this.userdetail.user_Id;

    this.service.ExporttoExcel(Companyid).subscribe({
      next: (res) => {
        this.isLoading = false;

        try {
          const base64File = res?.Data?.file;
          let apiFileName = res?.Data?.fileName;

          if (!base64File) {
            alert("No file received from the API");
            return;
          }

          // 🔧 Fix invalid characters in the filename
          apiFileName = apiFileName
            .replace(/\//g, "-")
            .replace(/:/g, "-")
            .replace(/ /g, "_");

          // remove .xlsx because your download function adds extension
          apiFileName = apiFileName.replace(".xlsx", "");

          this.downloadExcelFromBase64(base64File, apiFileName, "Excel");

          this.showAlertPopup("File downloaded successfully!");
        } catch (err) {
          console.error("Error exporting to Excel:", err);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Error loading data for export", err);
      },
    });
  }

  downloadExcelFromBase64(base64String: string, fileName: string, FileType): void {
    const byteCharacters = atob(base64String);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${fileName}_${FileType}.xlsx`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }



}
