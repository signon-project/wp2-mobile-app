import { TestBed } from '@angular/core/testing';

import { AcapellaService } from './acapella.service';

describe('AcapellaService', () => {
  let service: AcapellaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcapellaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
