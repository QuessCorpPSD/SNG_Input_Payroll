import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasternavigationComponent } from './masternavigation.component';

describe('MasternavigationComponent', () => {
  let component: MasternavigationComponent;
  let fixture: ComponentFixture<MasternavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasternavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MasternavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
