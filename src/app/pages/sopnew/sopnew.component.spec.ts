import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SopnewComponent } from './sopnew.component';

describe('SopnewComponent', () => {
  let component: SopnewComponent;
  let fixture: ComponentFixture<SopnewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SopnewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SopnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
