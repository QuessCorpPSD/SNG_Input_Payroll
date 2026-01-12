import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpfrontFinalApproveComponent } from './upfront-final-approve.component';

describe('UpfrontFinalApproveComponent', () => {
  let component: UpfrontFinalApproveComponent;
  let fixture: ComponentFixture<UpfrontFinalApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpfrontFinalApproveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpfrontFinalApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
