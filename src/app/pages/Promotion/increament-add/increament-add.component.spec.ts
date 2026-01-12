import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncreamentADDComponent } from './increament-add.component';

describe('IncreamentADDComponent', () => {
  let component: IncreamentADDComponent;
  let fixture: ComponentFixture<IncreamentADDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncreamentADDComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncreamentADDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
