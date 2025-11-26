import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandADDComponent } from './band-add.component';

describe('BandADDComponent', () => {
  let component: BandADDComponent;
  let fixture: ComponentFixture<BandADDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BandADDComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BandADDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
