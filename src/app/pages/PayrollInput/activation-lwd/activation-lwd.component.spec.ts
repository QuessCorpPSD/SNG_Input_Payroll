import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationLwdComponent } from './activation-lwd.component';

describe('ActivationLwdComponent', () => {
  let component: ActivationLwdComponent;
  let fixture: ComponentFixture<ActivationLwdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivationLwdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivationLwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
