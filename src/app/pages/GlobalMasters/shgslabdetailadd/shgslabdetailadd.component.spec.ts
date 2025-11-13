import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShgslabdetailaddComponent } from './shgslabdetailadd.component';

describe('ShgslabdetailaddComponent', () => {
  let component: ShgslabdetailaddComponent;
  let fixture: ComponentFixture<ShgslabdetailaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShgslabdetailaddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShgslabdetailaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
