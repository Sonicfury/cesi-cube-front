import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileResourcesComponent } from './profile-resources.component';

describe('ProfilRessourcesComponent', () => {
  let component: ProfileResourcesComponent;
  let fixture: ComponentFixture<ProfileResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileResourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
