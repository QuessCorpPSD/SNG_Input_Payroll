import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPFslabDetailsComponent } from './cpfslab-details.component';

describe('CPFslabDetailsComponent', () => {
  let component: CPFslabDetailsComponent;
  let fixture: ComponentFixture<CPFslabDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CPFslabDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CPFslabDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
