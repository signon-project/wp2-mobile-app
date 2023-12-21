import { TestBed } from '@angular/core/testing';

import { MediafiledataService } from './mediafiledata.service';

describe('MediafiledataService', () => {
  let service: MediafiledataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediafiledataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
