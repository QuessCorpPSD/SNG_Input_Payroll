import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldRequestComponent } from './hold-request.component';

describe('HoldRequestComponent', () => {
  let component: HoldRequestComponent;
  let fixture: ComponentFixture<HoldRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoldRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HoldRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
