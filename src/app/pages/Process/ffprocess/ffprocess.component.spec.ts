import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FFprocessComponent } from './ffprocess.component';

describe('FFprocessComponent', () => {
  let component: FFprocessComponent;
  let fixture: ComponentFixture<FFprocessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FFprocessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FFprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
