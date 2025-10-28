import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionComponent } from './extension.component';

describe('ExtensionComponent', () => {
  let component: ExtensionComponent;
  let fixture: ComponentFixture<ExtensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtensionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
