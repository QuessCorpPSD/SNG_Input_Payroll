import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveMasterMappingComponent } from './leave-master-mapping.component';

describe('LeaveMasterMappingComponent', () => {
  let component: LeaveMasterMappingComponent;
  let fixture: ComponentFixture<LeaveMasterMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveMasterMappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeaveMasterMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
