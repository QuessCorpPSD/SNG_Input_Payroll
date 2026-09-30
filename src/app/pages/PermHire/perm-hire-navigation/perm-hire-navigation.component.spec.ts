import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermHireNavigationComponent } from './perm-hire-navigation.component';

describe('PermHireNavigationComponent', () => {
  let component: PermHireNavigationComponent;
  let fixture: ComponentFixture<PermHireNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermHireNavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PermHireNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
