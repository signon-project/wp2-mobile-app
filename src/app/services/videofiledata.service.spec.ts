import { TestBed } from '@angular/core/testing';

import { VideofiledataService } from './videofiledata.service';

describe('VideofiledataService', () => {
  let service: VideofiledataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideofiledataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
