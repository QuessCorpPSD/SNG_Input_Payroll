import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEntityMasterComponent } from './add-entity-master.component';

describe('AddEntityMasterComponent', () => {
  let component: AddEntityMasterComponent;
  let fixture: ComponentFixture<AddEntityMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEntityMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEntityMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
