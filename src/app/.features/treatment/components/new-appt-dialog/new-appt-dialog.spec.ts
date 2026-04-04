import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewApptDialog } from './new-appt-dialog';

describe('NewTreatmentDialog', () => {
  let component: NewApptDialog;
  let fixture: ComponentFixture<NewApptDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewApptDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewApptDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
