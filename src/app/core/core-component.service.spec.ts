import { TestBed } from '@angular/core/testing';

import { CoreComponentService } from './core-component.service';

describe('CoreComponentService', () => {
  let service: CoreComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
