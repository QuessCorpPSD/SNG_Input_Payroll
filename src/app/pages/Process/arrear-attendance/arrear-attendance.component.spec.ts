import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrearAttendanceComponent } from './arrear-attendance.component';

describe('ArrearAttendanceComponent', () => {
  let component: ArrearAttendanceComponent;
  let fixture: ComponentFixture<ArrearAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrearAttendanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArrearAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
