import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesCard } from './notes-card';

describe('NotesCard', () => {
  let component: NotesCard;
  let fixture: ComponentFixture<NotesCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
