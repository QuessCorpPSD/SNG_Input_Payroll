import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousemploymenttaxdetailsComponent } from './previousemploymenttaxdetails.component';

describe('PreviousemploymenttaxdetailsComponent', () => {
  let component: PreviousemploymenttaxdetailsComponent;
  let fixture: ComponentFixture<PreviousemploymenttaxdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviousemploymenttaxdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviousemploymenttaxdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
