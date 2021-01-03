import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService, User } from './services/authentication/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class ProtectedGuard implements CanActivate {
    private user?: User;

    constructor(private authenticationService: AuthenticationService, private router: Router) {
        this.user = this.authenticationService.user;

        console.log(this.user);
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const url: string = state.url;

        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        if (this.user && this.user.email && this.user.id) {
            if (url.includes('auth')) {
                this.router.navigate(['/dashboard']);
            }
            return true;
        } else {
            this.router.navigate(['/auth/login']);

            return false;
        }
    }
}
