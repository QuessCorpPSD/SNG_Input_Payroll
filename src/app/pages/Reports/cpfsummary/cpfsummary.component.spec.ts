import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPFsummaryComponent } from './cpfsummary.component';

describe('CPFsummaryComponent', () => {
  let component: CPFsummaryComponent;
  let fixture: ComponentFixture<CPFsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CPFsummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CPFsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
