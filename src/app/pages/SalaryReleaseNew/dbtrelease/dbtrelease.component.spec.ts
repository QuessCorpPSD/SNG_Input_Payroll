import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DBTReleaseComponent } from './dbtrelease.component';

describe('DBTReleaseComponent', () => {
  let component: DBTReleaseComponent;
  let fixture: ComponentFixture<DBTReleaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DBTReleaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DBTReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
