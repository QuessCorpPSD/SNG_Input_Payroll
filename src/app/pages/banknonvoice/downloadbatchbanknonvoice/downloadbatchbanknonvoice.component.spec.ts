import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadbatchbanknonvoiceComponent } from './downloadbatchbanknonvoice.component';

describe('DownloadbatchbanknonvoiceComponent', () => {
  let component: DownloadbatchbanknonvoiceComponent;
  let fixture: ComponentFixture<DownloadbatchbanknonvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadbatchbanknonvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadbatchbanknonvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
