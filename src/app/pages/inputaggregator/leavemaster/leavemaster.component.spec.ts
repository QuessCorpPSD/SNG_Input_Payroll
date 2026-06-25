import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavemastersComponent } from './leavemaster.component';

describe('LeavemasterComponent', () => {
  let component: LeavemastersComponent;
  let fixture: ComponentFixture<LeavemastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavemastersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeavemastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
