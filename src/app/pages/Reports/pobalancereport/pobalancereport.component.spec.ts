import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PobalancereportComponent } from './pobalancereport.component';

describe('PobalancereportComponent', () => {
  let component: PobalancereportComponent;
  let fixture: ComponentFixture<PobalancereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PobalancereportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PobalancereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
