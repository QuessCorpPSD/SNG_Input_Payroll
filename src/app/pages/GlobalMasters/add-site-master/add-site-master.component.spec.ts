import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSiteMasterComponent } from './add-site-master.component';

describe('AddSiteMasterComponent', () => {
  let component: AddSiteMasterComponent;
  let fixture: ComponentFixture<AddSiteMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSiteMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSiteMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
