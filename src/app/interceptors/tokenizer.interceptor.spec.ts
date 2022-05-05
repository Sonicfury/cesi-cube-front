import { TestBed } from '@angular/core/testing';

import { TokenizerInterceptor } from './tokenizer.interceptor';

describe('TokenizerInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TokenizerInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: TokenizerInterceptor = TestBed.inject(TokenizerInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
