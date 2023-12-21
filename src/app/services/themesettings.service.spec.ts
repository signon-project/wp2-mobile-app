import { TestBed } from '@angular/core/testing';

import { ThemesettingsService } from './themesettings.service';

describe('ThemesettingsService', () => {
  let service: ThemesettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemesettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
