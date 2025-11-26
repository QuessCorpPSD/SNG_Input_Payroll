import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, timer } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class IdletimeoutService {
  private timeout = 5 * 60 * 1000; // 5 minutes (change as needed)

  constructor(private router: Router, private ngZone: NgZone) {
    this.startWatching();
  }

  private startWatching() {
    const userEvents = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'click'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'touchstart')
    );

    // run outside Angular to avoid triggering change detection too much
    this.ngZone.runOutsideAngular(() => {
      userEvents.pipe(
        startWith(null),
        switchMap(() => timer(this.timeout))
      ).subscribe(() => {
        // back inside Angular zone
        this.ngZone.run(() => {
          this.redirectToLogin();
        });
      });
    });
  }

  private redirectToLogin() {
    // clear user session if needed
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}