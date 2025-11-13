import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalmasternavigationComponent } from './globalmasternavigation.component';

describe('GlobalmasternavigationComponent', () => {
  let component: GlobalmasternavigationComponent;
  let fixture: ComponentFixture<GlobalmasternavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalmasternavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GlobalmasternavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
