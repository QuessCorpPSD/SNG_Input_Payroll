import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputationruleComponent } from './computationrule.component';

describe('ComputationruleComponent', () => {
  let component: ComputationruleComponent;
  let fixture: ComponentFixture<ComputationruleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComputationruleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComputationruleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
