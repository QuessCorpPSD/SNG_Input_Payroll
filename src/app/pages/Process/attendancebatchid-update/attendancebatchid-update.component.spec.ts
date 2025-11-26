import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancebatchidUpdateComponent } from './attendancebatchid-update.component';

describe('AttendancebatchidUpdateComponent', () => {
  let component: AttendancebatchidUpdateComponent;
  let fixture: ComponentFixture<AttendancebatchidUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendancebatchidUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttendancebatchidUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
