import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayregisterunprocessedComponent } from './payregisterunprocessed.component';

describe('PayregisterunprocessedComponent', () => {
  let component: PayregisterunprocessedComponent;
  let fixture: ComponentFixture<PayregisterunprocessedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayregisterunprocessedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayregisterunprocessedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
