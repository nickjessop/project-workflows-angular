import { Injectable } from '@angular/core';
import { from, BehaviorSubject } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';
import { Router } from '@angular/router';

export interface User {
    id: string;
    email: string | null;
    emailVerified: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private _user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
    public readonly $user = this._user.asObservable();

    public redirectUrl = '/dashboard';

    constructor(private firebaseService: FirebaseService, private router: Router) {
        const parsedUser = {
            id: localStorage.getItem('id') || '',
            email: localStorage.getItem('email'),
            emailVerified: !!localStorage.getItem('emailVerified'),
        };
        this.user = parsedUser;
    }

    public get user() {
        return this._user.getValue();
    }

    public set user(user) {
        this._user.next(user);
    }

    // TODO: subscribe to user modification event, and set this as the user here as well as local storage

    public login(email: string, password: string) {
        from(this.firebaseService.getAuthInstance()!.signInWithEmailAndPassword(email, password)).subscribe(
            firebaseUser => {
                if (!firebaseUser) {
                    return;
                }
                const { user } = firebaseUser;
                const parsedUser = {
                    id: user!.uid,
                    email: user!.email,
                    emailVerified: user!.emailVerified,
                };
                this.user = parsedUser;

                localStorage.setItem('id', parsedUser.id);
                localStorage.setItem('email', parsedUser.email || '');
                localStorage.setItem('emailVerified', parsedUser.emailVerified + '');

                this.router.navigate([this.redirectUrl]);
            }
        );
    }

    public logout() {
        from(this.firebaseService.getAuthInstance()!.signOut()).subscribe();
        this.user = null;
        localStorage.clear();
    }
}
