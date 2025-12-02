import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityMasterComponent } from './entity-master.component';

describe('EntityMasterComponent', () => {
  let component: EntityMasterComponent;
  let fixture: ComponentFixture<EntityMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntityMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
