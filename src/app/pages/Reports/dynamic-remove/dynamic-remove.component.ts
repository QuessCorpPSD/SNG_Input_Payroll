import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-dynamic-remove',
  standalone: true,
  imports: [MatIconModule, MatCardModule, MatTooltipModule, CommonModule, FormsModule],
  templateUrl: './dynamic-remove.component.html',
  styleUrl: './dynamic-remove.component.css'
})
export class DynamicRemoveComponent {
  pagename: any;
  isLoading = false;

}
