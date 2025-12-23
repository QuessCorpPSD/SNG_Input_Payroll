import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputationruleaddComponent } from './computationruleadd.component';

describe('ComputationruleaddComponent', () => {
  let component: ComputationruleaddComponent;
  let fixture: ComponentFixture<ComputationruleaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComputationruleaddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComputationruleaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
