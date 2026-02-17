import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadbatchComponent } from './downloadbatch.component';

describe('DownloadbatchComponent', () => {
  let component: DownloadbatchComponent;
  let fixture: ComponentFixture<DownloadbatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadbatchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DownloadbatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
