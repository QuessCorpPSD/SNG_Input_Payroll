import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingService } from './LoadingService ';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule,MatProgressSpinnerModule ],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.css'
})
export class ProgressComponent {
  loading$ = this.loadingService.loading$;
  constructor(private loadingService: LoadingService) {}
}
