import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlapPercentageComponent } from './slap-percentage.component';

describe('SlapPercentageComponent', () => {
  let component: SlapPercentageComponent;
  let fixture: ComponentFixture<SlapPercentageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlapPercentageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlapPercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
