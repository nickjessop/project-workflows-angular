import { TestBed, async, inject } from '@angular/core/testing';

import { ThankYouGuard } from './thank-you.guard';

describe('ThankYouGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThankYouGuard]
    });
  });

  it('should ...', inject([ThankYouGuard], (guard: ThankYouGuard) => {
    expect(guard).toBeTruthy();
  }));
});
