import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankDetailsComponent } from '../bank-details/bank-details.component';
import { BankApprovalComponent } from '../bank-approval/bank-approval.component';

@Component({
  selector: 'bankaccount',
  standalone: true,
  imports: [CommonModule,BankDetailsComponent,BankApprovalComponent],
  templateUrl: './bank-account.component.html',
  styleUrl: './bank-account.component.css'
})
export class BankAccountComponent {

  activeMenu: 'BankDetails' | 'BankApproval' = 'BankDetails';

  selectMenu(menu: 'BankDetails' | 'BankApproval') {
    this.activeMenu = menu;
  }
}
