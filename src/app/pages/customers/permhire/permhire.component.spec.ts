import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermhireComponent } from './permhire.component';

describe('PermhireComponent', () => {
  let component: PermhireComponent;
  let fixture: ComponentFixture<PermhireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermhireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PermhireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
