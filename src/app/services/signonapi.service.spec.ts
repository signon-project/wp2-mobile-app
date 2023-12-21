import { TestBed } from '@angular/core/testing';

import { SignonapiService } from './signonapi.service';

describe('SignonapiService', () => {
  let service: SignonapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignonapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
