import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryReleaseMenuComponent } from './salary-release-menu.component';

describe('SalaryReleaseMenuComponent', () => {
  let component: SalaryReleaseMenuComponent;
  let fixture: ComponentFixture<SalaryReleaseMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryReleaseMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalaryReleaseMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
