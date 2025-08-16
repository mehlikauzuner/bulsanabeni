import { TestBed } from '@angular/core/testing';

import { GezilerService } from './geziler-service';

describe('GezilerService', () => {
  let service: GezilerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GezilerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
