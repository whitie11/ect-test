import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindSaveSU } from './find-save-su';

describe('FindSaveSU', () => {
  let component: FindSaveSU;
  let fixture: ComponentFixture<FindSaveSU>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindSaveSU]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindSaveSU);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
