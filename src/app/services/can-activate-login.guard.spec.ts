import { TestBed } from '@angular/core/testing';

import { CanActivateLogin } from './can-activate-login.service';

describe('LoginGuard', () => {
  let guard: CanActivateLogin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanActivateLogin);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
