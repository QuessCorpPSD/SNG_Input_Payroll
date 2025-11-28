import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POInitiateComponent } from './poinitiate.component';

describe('POInitiateComponent', () => {
  let component: POInitiateComponent;
  let fixture: ComponentFixture<POInitiateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [POInitiateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(POInitiateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
