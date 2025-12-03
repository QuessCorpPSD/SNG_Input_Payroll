import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlapFixedComponent } from './slap-fixed.component';

describe('SlapFixedComponent', () => {
  let component: SlapFixedComponent;
  let fixture: ComponentFixture<SlapFixedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlapFixedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlapFixedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
