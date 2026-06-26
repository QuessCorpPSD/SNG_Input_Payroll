import { Component } from '@angular/core';

import { IndexComponent } from './account/index/index.component';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { PdfService } from './Service/pdf.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SPD Web UI';
  constructor(public service : PdfService) {
    // this.service.fillAllPdfFieldsAndDownload();
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     console.log('Navigated to:', event.url);
    //   }
    // });
}
}