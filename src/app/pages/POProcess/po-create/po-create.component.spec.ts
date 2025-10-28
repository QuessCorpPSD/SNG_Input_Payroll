import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoCreateComponent } from './po-create.component';

describe('PoCreateComponent', () => {
  let component: PoCreateComponent;
  let fixture: ComponentFixture<PoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
