import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingResourcesComponent } from './pending-resources.component';

describe('PendingResourcesComponent', () => {
  let component: PendingResourcesComponent;
  let fixture: ComponentFixture<PendingResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingResourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
