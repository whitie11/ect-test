import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStageDialog } from './change-stage-dialog';

describe('ChangeStageDialog', () => {
  let component: ChangeStageDialog;
  let fixture: ComponentFixture<ChangeStageDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeStageDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeStageDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
