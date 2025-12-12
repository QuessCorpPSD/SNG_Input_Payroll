import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanypermissionComponent } from './companypermission.component';

describe('CompanypermissionComponent', () => {
  let component: CompanypermissionComponent;
  let fixture: ComponentFixture<CompanypermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanypermissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanypermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
