import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-upfront-portal-final-approval',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MatIconModule,MatTooltipModule],
  templateUrl: './upfront-portal-final-approval.component.html',
  styleUrl: './upfront-portal-final-approval.component.css'
})
export class UpfrontPortalFinalApprovalComponent {

}
