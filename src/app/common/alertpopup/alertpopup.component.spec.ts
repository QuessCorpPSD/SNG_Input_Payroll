import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertpopupComponent } from './alertpopup.component';

describe('AlertpopupComponent', () => {
  let component: AlertpopupComponent;
  let fixture: ComponentFixture<AlertpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertpopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
