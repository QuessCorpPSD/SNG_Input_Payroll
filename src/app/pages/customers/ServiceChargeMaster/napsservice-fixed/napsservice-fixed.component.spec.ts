import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NapsserviceFixedComponent } from './napsservice-fixed.component';

describe('NapsserviceFixedComponent', () => {
  let component: NapsserviceFixedComponent;
  let fixture: ComponentFixture<NapsserviceFixedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NapsserviceFixedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NapsserviceFixedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
