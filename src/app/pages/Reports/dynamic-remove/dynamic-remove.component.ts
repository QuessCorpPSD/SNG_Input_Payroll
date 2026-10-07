import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DynamicRemoveService } from '../../../Service/Reports/dynamic-remove.service';
import { IDynamicRemove } from '../../../Repository/Reports/IDynamicRemove';
import * as XLSX from 'xlsx';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
export const Pay_Token = new InjectionToken<IDynamicRemove>('Pay_Token');
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dynamic-remove',
  standalone: true,
  imports: [MatIconModule, MatCardModule, MatTooltipModule, CommonModule, FormsModule],
  templateUrl: './dynamic-remove.component.html',
  styleUrl: './dynamic-remove.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: DynamicRemoveService,
    }
  ]
})
export class DynamicRemoveComponent {
  pagename: any;
  isLoading = false;
  page: any;
  userdetail: any;
  selectedDynamicDropdownName: string = '';


  constructor(@Inject(Pay_Token) private service: DynamicRemoveService, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService,) { }

  ngOnInit() {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.BindPageName();
  }

  onPageChange(id: number): void {
    const selectedPage = this.page.find(
      (p: any) => p.Id === Number(id)
    );

    this.selectedDynamicDropdownName =
      selectedPage?.EntityName || '';
  }

  BindPageName() {
    this.service.getPageName().subscribe({
      next: (res: any) => {
        this.page = res?.Data?.data?.Table0;
      }
    });
  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileChange(event: Event): void {

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    // Validate Page Name
    if (
      this.pagename === null ||
      this.pagename === undefined ||
      this.pagename === 0 ||
      this.pagename === ''
    ) {
      alert("Please select Page Name");
      input.value = '';
      return;
    }

    // Validate file
    if (!file) {
      alert("Please upload only one Excel file");
      input.value = '';
      return;
    }

    // Find selected page
    const selectedPage = this.page.find(
      (p: any) =>
        Number(p.Dynamicdropdown_Id) === Number(this.pagename)
    );

    if (!selectedPage) {
      alert("Invalid Page Name selected");
      input.value = '';
      return;
    }

    // Get selected page name
    const dynamicDropdownName =
      selectedPage.Dynamicdropdown_Name;

    if (!dynamicDropdownName) {
      alert("Page Name is missing");
      input.value = '';
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', this.userdetail.user_Id.toString());
    formData.append('Dynamicdropdown_Id', selectedPage.Dynamicdropdown_Id.toString());
    formData.append('Dynamicdropdown_Name', selectedPage.Dynamicdropdown_Name);

    this.service.import(formData).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({

      next: (res: any) => {

        this.isLoading = false;

        console.log("API Response:", res);

        if (!res || !res.Data) {
          alert(
            "Upload request processed. Server did not return any data."
          );
          return;
        }

        // Success
        if (
          res?.Data?.response?.includes(
            "Row(s) Uploaded Successfully."
          )
        ) {
          alert("Row(s) Uploaded Successfully.");
          return;
        }

        // Parse response
        const { parsed, msg } =
          this.tryParseResponse(
            res?.Data?.response
          );

        const successMsg =
          'Row(s) Uploaded Successfully.';

        const successMatch =
          (
            Array.isArray(parsed) &&
            parsed[0]?.Error_Message?.trim() === successMsg
          ) ||
          (
            parsed &&
            typeof parsed === 'object' &&
            parsed?.Error_Message?.trim() === successMsg
          );

        if (
          res?.StatusCode === 200 &&
          successMatch
        ) {
          return;
        }

        // Failed import
        if (
          res?.StatusCode === 200 &&
          msg?.trim() === 'Failed to import.'
        ) {

          alert("Failed to Import");

          const rawErr =
            res?.Data?.errors?.[0];

          let errorArray: any[] = [];

          try {

            if (typeof rawErr === 'string') {

              const tryJson =
                JSON.parse(rawErr);

              errorArray =
                Array.isArray(tryJson)
                  ? tryJson
                  : [tryJson];

            } else if (
              Array.isArray(rawErr)
            ) {

              errorArray = rawErr;

            } else if (rawErr) {

              errorArray = [rawErr];
            }

          } catch {

            errorArray = rawErr
              ? [
                {
                  Error_Message:
                    String(rawErr)
                }
              ]
              : [];
          }

          const exportData =
            errorArray.map(
              (item: any) => ({
                Error_Message:
                  item?.Error_Message || ''
              })
            );

          if (exportData.length > 0) {

            const worksheet:
              XLSX.WorkSheet =
              XLSX.utils.json_to_sheet(
                exportData
              );

            const workbook:
              XLSX.WorkBook = {
              Sheets: {
                ErrorMessages: worksheet
              },
              SheetNames: [
                'ErrorMessages'
              ]
            };

            XLSX.writeFile(workbook, 'ErrorMessages_DeleteOption.xlsx');
          }

          return;
        }

        // Data contains Error_Message
        if (
          Array.isArray(res.Data) &&
          res.Data[0]?.Error_Message
        ) {

          alert(
            res.Data[0].Error_Message
          );

          return;
        }

        // Fallback
        const fallback =
          msg ||
          (
            Array.isArray(parsed)
              ? JSON.stringify(parsed)
              : (
                parsed &&
                typeof parsed === 'object' &&
                parsed.Error_Message
              )
                ? parsed.Error_Message
                : (
                  parsed
                    ? JSON.stringify(parsed)
                    : ''
                )
          );

        if (fallback) {
          alert(fallback);
        } else {
          alert(
            "Error while processing response."
          );
        }
      },

      error: (err: any) => {

        this.isLoading = false;

        console.error(
          "Delete Option Upload Error:",
          err
        );

        // Validation errors
        if (err?.error?.errors) {

          const errors =
            err.error.errors;

          const messages: string[] = [];

          Object.keys(errors).forEach(
            (key: string) => {

              if (
                Array.isArray(errors[key])
              ) {
                messages.push(
                  ...errors[key]
                );
              }
            }
          );

          if (messages.length > 0) {
            alert(
              messages.join('\n')
            );
            return;
          }
        }

        alert(err?.error?.Message || err?.error?.message);
      }
    });
  }


  tryParseResponse(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };

    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') return { parsed: r, msg: '' };

    // string
    if (typeof r === 'string') {
      try {
        const p = JSON.parse(r);
        return { parsed: p, msg: '' };
      } catch {
        return { parsed: null, msg: r };
      }
    }

    return { parsed: null, msg: String(r) };
  }

  downloadTemplate(): void {

    const pageId = Number(this.pagename);

    if (!pageId) {
      alert('Please select Page Name');
      return;
    }

    // Headers based on Dynamicdropdown_Id
    const headersMap: { [key: number]: string[] } = {

      // 1 - New joinee salary
      1: [
        'COMPCODE',
        'EMPCODE',
        'BAND',
        'PAYCODE',
        'AMOUNT',
        'PAYSEQUENCENO'
      ],

      // 2 - Increment
      2: [
        'COMPANYCODE',
        'EMPLOYEECODE',
        'BAND',
        'NEWCTC',
        'EFFECTIVEDATE',
        'ENDDATE',
        'PAYSEQUENCENO',
        'PAYCODE',
        'AMOUNT',
        'ARREARFLAG'
      ],

      // 3 - Pay Transaction
      3: [
        'COMPCODE',
        'PAYSEQUENCENO',
        'PAYCODE',
        'BAND',
        'EMPID',
        'AMOUNT'
      ],

      // 4 - One Time Replacement
      4: [
        'Compcode',
        'Payseqno',
        'Paycode',
        'Band',
        'Empcode',
        'Amount',
        'ModeofEntry',
        'Type',
        'ArrearPayseqno',
        'Pay_Type'
      ],

      // 5 - Other Income
      5: [
        'Company_Code',
        'Employee_Code',
        'Pay_Sequence_No',
        'Incentive_Paid_Pay_Sequence_No',
        'Pay_Code',
        'Reason',
        'Input_No',
        'Amount',
        'Map_Name'
      ],

      // 6 - Lop Adjustment
      6: [
        'COMPCODE',
        'PAYSEQUENCENO',
        'EMPCODE',
        'LOPLOPRPayseqno'
      ]
    };

    const headers = headersMap[pageId];

    if (!headers) {
      alert('Template not available for the selected page.');
      return;
    }

    // Create empty row
    const row: any = {};

    headers.forEach((header: string) => {
      row[header] = '';
    });

    // Create worksheet
    const workSheet: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(
        [row],
        {
          header: headers
        }
      );

    // Create workbook
    const workbook: XLSX.WorkBook = {
      Sheets: {
        'table': workSheet
      },
      SheetNames: ['table']
    };

    // Get selected page name
    const selectedPage = this.page.find(
      (p: any) =>
        Number(p.Dynamicdropdown_Id) === pageId
    );

    const pageName =
      selectedPage?.Dynamicdropdown_Name || 'DeleteOption';

    // Make safe filename
    const fileName = pageName
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_');

    // Download
    XLSX.writeFile(
      workbook,
      `${fileName}_Template.xlsx`
    );
  }


}
