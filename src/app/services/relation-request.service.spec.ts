import { TestBed } from '@angular/core/testing';

import { RelationRequestService } from './relation-request.service';

describe('RelationRequestService', () => {
  let service: RelationRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelationRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
