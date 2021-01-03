import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService, User } from './services/authentication/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class ProtectedGuard implements CanActivate {
    private user?: User;
    private subscriptions: Subscription = new Subscription();

    constructor(private authenticationService: AuthenticationService, private router: Router) {
        this.subscriptions.add(
            this.authenticationService.$user?.subscribe(user => {
                this.user = user;
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
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
            return true;
        } else {
            this.router.navigate(['/auth/login']);

            return false;
        }
    }
}
