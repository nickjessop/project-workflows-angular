import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class ThankYouGuard implements CanActivate {
    constructor(private authenticationService: AuthenticationService, private router: Router) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const url: string = state.url;
        const currentUser = this.authenticationService.getCurrentUser();
        const canProceed = !!currentUser;

        if (canProceed) {
            return true;
        } else {
            const didNavigate = this.router.navigate(['${url}']);

            return didNavigate;
        }
    }
}
