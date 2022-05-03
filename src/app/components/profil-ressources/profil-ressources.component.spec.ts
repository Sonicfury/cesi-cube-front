import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilRessourcesComponent } from './profil-ressources.component';

describe('ProfilRessourcesComponent', () => {
  let component: ProfilRessourcesComponent;
  let fixture: ComponentFixture<ProfilRessourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilRessourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilRessourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
