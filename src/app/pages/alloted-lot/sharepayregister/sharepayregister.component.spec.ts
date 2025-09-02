import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharepayregisterComponent } from './sharepayregister.component';

describe('SharepayregisterComponent', () => {
  let component: SharepayregisterComponent;
  let fixture: ComponentFixture<SharepayregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharepayregisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharepayregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
