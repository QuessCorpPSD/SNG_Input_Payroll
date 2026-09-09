import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermhireRequestComponent } from './permhire-request.component';

describe('PermhireRequestComponent', () => {
  let component: PermhireRequestComponent;
  let fixture: ComponentFixture<PermhireRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermhireRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PermhireRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
