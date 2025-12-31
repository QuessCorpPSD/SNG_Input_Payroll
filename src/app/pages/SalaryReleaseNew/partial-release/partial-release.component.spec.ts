import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialReleaseComponent } from './partial-release.component';

describe('PartialReleaseComponent', () => {
  let component: PartialReleaseComponent;
  let fixture: ComponentFixture<PartialReleaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartialReleaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartialReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
