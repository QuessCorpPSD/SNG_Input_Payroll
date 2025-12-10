import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditnoteapproveComponent } from './creditnoteapprove.component';

describe('CreditnoteapproveComponent', () => {
  let component: CreditnoteapproveComponent;
  let fixture: ComponentFixture<CreditnoteapproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditnoteapproveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreditnoteapproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
