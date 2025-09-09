import { Component, EventEmitter, Input, Output, InjectionToken, Inject, OnInit } from '@angular/core';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'psdstatus',
  imports: [MatCardModule, CommonModule],
  standalone:true,
  templateUrl: './psdstatus.component.html',
  styleUrls: ['./psdstatus.component.css'], 
  providers: [{
    provide: COMM_TOKEN,
    useClass: CommonService
  }]
})
export class PsdstatusComponent implements OnInit {
  @Input() Company_Id?: number;
  @Input() pay_period_id?: number;
  @Input() lotnumber?: number;
  @Input() payroll_Input_Type: string = '';
  @Input() InputText: string = '';

  @Output() close = new EventEmitter<void>();
  lotStatus: any;

  constructor(@Inject(COMM_TOKEN) private commonService: ICommonService) { }

  ngOnInit(): void {
    this.GetLotStatus();
  }

  GetLotStatus() {

    const formData = new FormData();
    formData.append('Company_Id', String(this.Company_Id ?? ''));
    formData.append('pay_period_id', String(this.pay_period_id ?? ''));
    formData.append('lotnumber', String(this.lotnumber ?? ''));
    //formData.append('UpdateStatus', 's');
    formData.append('Payroll_Input_Type', this.payroll_Input_Type);

    this.commonService.LotStatus(formData).subscribe({
      next: res => {
        this.lotStatus = {
                            qC_Verified_Status: 0,
                            report_Status: 0,
                            customer_Confirmation_Status:0,
                            Invoice_Status:0
                          };//res.data;
      },
      error: error => console.error('Error:', error)
    });
  }

  closeclick() {
    this.close.emit();
  }
}
