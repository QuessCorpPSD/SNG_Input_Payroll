import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionNavigationComponent } from './promotion-navigation.component';

describe('PromotionNavigationComponent', () => {
  let component: PromotionNavigationComponent;
  let fixture: ComponentFixture<PromotionNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionNavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromotionNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
