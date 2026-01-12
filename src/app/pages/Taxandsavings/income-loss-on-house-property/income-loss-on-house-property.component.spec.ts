import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeLossOnHousePropertyComponent } from './income-loss-on-house-property.component';

describe('IncomeLossOnHousePropertyComponent', () => {
  let component: IncomeLossOnHousePropertyComponent;
  let fixture: ComponentFixture<IncomeLossOnHousePropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeLossOnHousePropertyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncomeLossOnHousePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
