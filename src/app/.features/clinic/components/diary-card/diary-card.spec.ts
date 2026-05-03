import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaryCard } from './diary-card';

describe('DiaryCard', () => {
  let component: DiaryCard;
  let fixture: ComponentFixture<DiaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiaryCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiaryCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
