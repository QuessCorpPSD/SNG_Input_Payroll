import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscPaycodeMappingComponent } from './misc-paycode-mapping.component';

describe('MiscPaycodeMappingComponent', () => {
  let component: MiscPaycodeMappingComponent;
  let fixture: ComponentFixture<MiscPaycodeMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiscPaycodeMappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MiscPaycodeMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
