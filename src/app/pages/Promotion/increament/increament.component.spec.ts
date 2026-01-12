import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncreamentComponent } from './increament.component';

describe('IncreamentComponent', () => {
  let component: IncreamentComponent;
  let fixture: ComponentFixture<IncreamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncreamentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncreamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
