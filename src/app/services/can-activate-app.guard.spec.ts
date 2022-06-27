import { TestBed } from '@angular/core/testing';

import { CanActivateApp } from './can-activate-app.guard';

describe('AuthGuard', () => {
  let guard: CanActivateApp;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanActivateApp);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
