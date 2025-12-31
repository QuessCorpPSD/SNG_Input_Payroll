import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryReleaseComponent } from './salary-release.component';

describe('SalaryReleaseComponent', () => {
  let component: SalaryReleaseComponent;
  let fixture: ComponentFixture<SalaryReleaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryReleaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalaryReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
