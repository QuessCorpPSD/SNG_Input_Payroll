import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryReleaseStatusComponent } from './salary-release-status.component';

describe('SalaryReleaseStatusComponent', () => {
  let component: SalaryReleaseStatusComponent;
  let fixture: ComponentFixture<SalaryReleaseStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryReleaseStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalaryReleaseStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
