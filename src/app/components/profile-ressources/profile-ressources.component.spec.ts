import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileRessourcesComponent } from './profile-ressources.component';

describe('ProfilRessourcesComponent', () => {
  let component: ProfileRessourcesComponent;
  let fixture: ComponentFixture<ProfileRessourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileRessourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileRessourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
