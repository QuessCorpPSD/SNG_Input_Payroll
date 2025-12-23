import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffercreationComponent } from './offercreation.component';

describe('OffercreationComponent', () => {
  let component: OffercreationComponent;
  let fixture: ComponentFixture<OffercreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffercreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OffercreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
