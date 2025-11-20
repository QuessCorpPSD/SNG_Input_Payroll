import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowReProcessComponent } from './allow-re-process.component';

describe('AllowReProcessComponent', () => {
  let component: AllowReProcessComponent;
  let fixture: ComponentFixture<AllowReProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllowReProcessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllowReProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
