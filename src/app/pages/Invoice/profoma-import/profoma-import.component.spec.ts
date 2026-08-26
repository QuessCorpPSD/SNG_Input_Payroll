import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfomaImportComponent } from './profoma-import.component';

describe('ProfomaImportComponent', () => {
  let component: ProfomaImportComponent;
  let fixture: ComponentFixture<ProfomaImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfomaImportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfomaImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
