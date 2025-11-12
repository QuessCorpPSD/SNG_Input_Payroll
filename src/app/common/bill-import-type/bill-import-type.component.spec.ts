import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillImportTypeComponent } from './bill-import-type.component';

describe('BillImportTypeComponent', () => {
  let component: BillImportTypeComponent;
  let fixture: ComponentFixture<BillImportTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillImportTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillImportTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
