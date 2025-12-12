import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminnavigationComponent } from './adminnavigation.component';

describe('AdminnavigationComponent', () => {
  let component: AdminnavigationComponent;
  let fixture: ComponentFixture<AdminnavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminnavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminnavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
