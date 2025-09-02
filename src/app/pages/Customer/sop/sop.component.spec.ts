import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SopComponent } from './sop.component';

describe('SopComponent', () => {
  let component: SopComponent;
  let fixture: ComponentFixture<SopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SopComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
