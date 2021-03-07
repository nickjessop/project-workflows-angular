import { TestBed, async, inject } from '@angular/core/testing';

import { ProtectedGuard } from './protected.guard';

describe('ProtectedGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ProtectedGuard],
        });
    });

    it('should ...', inject([ProtectedGuard], (guard: ProtectedGuard) => {
        expect(guard).toBeTruthy();
    }));
});
