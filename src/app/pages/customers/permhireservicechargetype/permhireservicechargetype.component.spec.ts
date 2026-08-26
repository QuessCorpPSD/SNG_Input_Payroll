import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermhireservicechargetypeComponent } from './permhireservicechargetype.component';

describe('PermhireservicechargetypeComponent', () => {
  let component: PermhireservicechargetypeComponent;
  let fixture: ComponentFixture<PermhireservicechargetypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermhireservicechargetypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PermhireservicechargetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
