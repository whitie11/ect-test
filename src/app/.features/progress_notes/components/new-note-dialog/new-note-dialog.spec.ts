import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNoteDialog } from './new-note-dialog';

describe('NewNoteDialog', () => {
  let component: NewNoteDialog;
  let fixture: ComponentFixture<NewNoteDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewNoteDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewNoteDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
