import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication/authentication.service';
import { FirebaseService } from './services/firebase/firebase.service';

@Injectable({
    providedIn: 'root',
})
export class ProtectedGuard implements CanActivate {
    constructor(
        private authenticationService: AuthenticationService,
        private firebaseService: FirebaseService,
        private router: Router
    ) {}

    ngOnDestroy() {}

    canActivate() {
        // return this.authenticationService.$user!.pipe(
        //     take(1),
        //     switchMap(user => {
        //         if (user) {
        //             return of(true);
        //         } else {
        //             this.router.navigate(['/auth/login']);
        //             return of(false);
        //         }
        //     })
        // );
        return true;
    }
}
