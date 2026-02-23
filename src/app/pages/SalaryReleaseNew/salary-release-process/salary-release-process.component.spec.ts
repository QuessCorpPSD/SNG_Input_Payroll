import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryReleaseProcessComponent } from './salary-release-process.component';

describe('SalaryReleaseProcessComponent', () => {
  let component: SalaryReleaseProcessComponent;
  let fixture: ComponentFixture<SalaryReleaseProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryReleaseProcessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalaryReleaseProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
