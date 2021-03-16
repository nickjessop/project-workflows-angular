import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { filter, switchMap, take } from 'rxjs/operators';
import { AuthenticationService, AuthStatus } from './services/authentication/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class RedirectGuard implements CanActivate {
    constructor(private authenticationService: AuthenticationService, private router: Router) {}

    canActivate() {
        return this.authenticationService.$loginStatus.pipe(
            filter(status => {
                return status.authStatus !== AuthStatus.UNKNOWN;
            }),
            take(1),
            switchMap(status => {
                const user = this.authenticationService.user;
                if (user !== undefined && user !== null) {
                    this.router.navigate(['/dashboard']);
                    return of(false);
                } else {
                    return of(true);
                }
            })
        );
    }
}
