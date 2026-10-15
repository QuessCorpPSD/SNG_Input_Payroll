import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupnameallComponent } from './groupnameall.component';

describe('GroupnameallComponent', () => {
  let component: GroupnameallComponent;
  let fixture: ComponentFixture<GroupnameallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupnameallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupnameallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
