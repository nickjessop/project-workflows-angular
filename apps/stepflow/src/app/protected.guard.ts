import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { filter, of, switchMap, take } from 'rxjs';
import { AuthenticationService, AuthStatus } from './services/authentication/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class ProtectedGuard implements CanActivate {
    constructor(private authenticationService: AuthenticationService, private router: Router) {}

    canActivate() {
        return this.authenticationService.$loginStatus.pipe(
            filter(status => {
                return status.authStatus !== AuthStatus.UNKNOWN;
            }),
            take(1),
            switchMap(status => {
                const user = this.authenticationService.user;
                if (user == null || !this.authenticationService.allowedUserIds.includes(user.id || '')) {
                    this.authenticationService.logout(true);
                    this.router.navigate(['/auth/login']);
                    return of(false);
                } else {
                    return of(true);
                }
            })
        );
    }
}
