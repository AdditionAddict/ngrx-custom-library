import { TestBed } from '@angular/core/testing';

import { CelestialBodyService } from './celestial-body.service';

describe('CelestialBodyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CelestialBodyService = TestBed.get(CelestialBodyService);
    expect(service).toBeTruthy();
  });
});
