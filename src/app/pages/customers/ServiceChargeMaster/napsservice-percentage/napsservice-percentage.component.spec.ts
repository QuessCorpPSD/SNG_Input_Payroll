import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NapsservicePercentageComponent } from './napsservice-percentage.component';

describe('NapsservicePercentageComponent', () => {
  let component: NapsservicePercentageComponent;
  let fixture: ComponentFixture<NapsservicePercentageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NapsservicePercentageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NapsservicePercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
