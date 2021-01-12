import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService, User } from './services/authentication/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class ProtectedGuard implements CanActivate {
    private user?: User;
    // private subscriptions = new Subscription();

    constructor(private authenticationService: AuthenticationService, private router: Router) {}

    ngOnDestroy() {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.authenticationService.user) {
            return true;
        } else {
            this.router.navigate(['/auth/login']);

            return false;
        }
    }
}
