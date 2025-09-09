import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalsubmissionComponent } from './finalsubmission.component';

describe('FinalsubmissionComponent', () => {
  let component: FinalsubmissionComponent;
  let fixture: ComponentFixture<FinalsubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalsubmissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinalsubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
