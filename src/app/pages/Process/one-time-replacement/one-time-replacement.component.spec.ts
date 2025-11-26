import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneTimeReplacementComponent } from './one-time-replacement.component';

describe('OneTimeReplacementComponent', () => {
  let component: OneTimeReplacementComponent;
  let fixture: ComponentFixture<OneTimeReplacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OneTimeReplacementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OneTimeReplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
