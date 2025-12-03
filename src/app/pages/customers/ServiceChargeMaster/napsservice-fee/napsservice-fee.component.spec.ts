import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NAPSserviceFeeComponent } from './napsservice-fee.component';

describe('NAPSserviceFeeComponent', () => {
  let component: NAPSserviceFeeComponent;
  let fixture: ComponentFixture<NAPSserviceFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NAPSserviceFeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NAPSserviceFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
