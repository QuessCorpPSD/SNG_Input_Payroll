import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShgslabdetailComponent } from './shgslabdetail.component';

describe('ShgslabdetailComponent', () => {
  let component: ShgslabdetailComponent;
  let fixture: ComponentFixture<ShgslabdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShgslabdetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShgslabdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
