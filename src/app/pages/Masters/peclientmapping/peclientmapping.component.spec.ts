import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PEclientmappingComponent } from './peclientmapping.component';

describe('PEclientmappingComponent', () => {
  let component: PEclientmappingComponent;
  let fixture: ComponentFixture<PEclientmappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PEclientmappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PEclientmappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
