import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoNavigationComponent } from './po-navigation.component';

describe('PoNavigationComponent', () => {
  let component: PoNavigationComponent;
  let fixture: ComponentFixture<PoNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
