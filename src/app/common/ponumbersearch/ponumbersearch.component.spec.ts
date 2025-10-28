import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PonumbersearchComponent } from './ponumbersearch.component';

describe('PonumbersearchComponent', () => {
  let component: PonumbersearchComponent;
  let fixture: ComponentFixture<PonumbersearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PonumbersearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PonumbersearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
