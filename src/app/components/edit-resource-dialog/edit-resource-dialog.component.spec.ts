import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditResourceDialogComponent } from './edit-resource-dialog.component';

describe('EditResourceDialogComponent', () => {
  let component: EditResourceDialogComponent;
  let fixture: ComponentFixture<EditResourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditResourceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
