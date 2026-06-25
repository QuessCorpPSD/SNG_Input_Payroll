import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscpaycodemappingComponent } from './miscpaycodemapping.component';

describe('MiscpaycodemappingComponent', () => {
  let component: MiscpaycodemappingComponent;
  let fixture: ComponentFixture<MiscpaycodemappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiscpaycodemappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MiscpaycodemappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
