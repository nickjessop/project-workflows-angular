import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService, User } from './services/authentication/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class ProtectedGuard implements CanActivate {
    private user: User | null = null;

    constructor(private authenticationService: AuthenticationService, private router: Router) {
        this.authenticationService.$user.subscribe(user => {
            this.user = user;
        });
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const url: string = state.url;

        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        if (this.user) {
            return true;
        } else {
            // Navigate to the login page with extras
            this.router.navigate(['/auth/login']);

            return false;
        }
    }
}
