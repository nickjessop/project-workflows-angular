import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './services/authentication/authentication.service';
import { FirebaseService } from './services/firebase/firebase.service';

@Injectable({
    providedIn: 'root',
})
export class ProtectedGuard implements CanActivate {
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,
        private firebaseService: FirebaseService
    ) {}

    ngOnDestroy() {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.firebaseService.getAuthInstance().currentUser) {
            return true;
        } else {
            this.router.navigate(['/auth/login']);

            return false;
        }
        // if (this.authenticationService.user) {
        //     return true;
        // } else {
        //     this.router.navigate(['/auth/login']);

        //     return false;
        // }
    }
}
