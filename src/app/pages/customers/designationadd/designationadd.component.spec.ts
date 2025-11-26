import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationaddComponent } from './designationadd.component';

describe('DesignationaddComponent', () => {
  let component: DesignationaddComponent;
  let fixture: ComponentFixture<DesignationaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignationaddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesignationaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
