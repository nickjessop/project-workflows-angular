import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, from } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';

export interface User {
    id?: string;
    email?: string;
    emailVerified?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private _user?: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
    public readonly $user = this._user?.asObservable();

    public redirectUrl = '/dashboard';

    constructor(
        private firebaseService: FirebaseService,
        private router: Router,
        private messageService: MessageService
    ) {
        const parsedUser = {
            id: localStorage.getItem('id') || undefined,
            email: localStorage.getItem('email') || undefined,
            emailVerified: !!localStorage.getItem('emailVerified') || undefined,
        };

        if (!parsedUser.email || !parsedUser.email) {
            this.user = undefined;
        } else {
            this.user = parsedUser;
        }
    }

    public get user() {
        return this._user?.getValue();
    }

    public set user(user) {
        this._user?.next(user);
    }

    // TODO: subscribe to user modification event, and set this as the user here as well as local storage

    public register(email: string, password: string, password2: string, name: string, plan: string) {
        if (password !== password2) {
            this.messageService.add({
                severity: 'error',
                key: 'global-toast',
                life: 2000,
                closable: true,
                detail: 'Passwords do not match',
            });

            return;
        }

        from(this.firebaseService.getAuthInstance().createUserWithEmailAndPassword(email, password)).subscribe(
            firebaseUser => {
                const { user } = firebaseUser;
                const parsedUser = {
                    id: user!.uid,
                    email: user!.email || undefined,
                    emailVerified: user!.emailVerified,
                };
                this.user = parsedUser;
                localStorage.setItem('id', parsedUser.id);
                localStorage.setItem('email', parsedUser.email || '');
                localStorage.setItem('emailVerified', parsedUser.emailVerified + '');

                const currentUser = this.firebaseService.getAuthInstance().currentUser;

                if (currentUser) {
                    currentUser
                        .updateProfile({
                            displayName: name,
                        })
                        .then(
                            () => {
                                this.firebaseService
                                    .getDbInstance()
                                    .collection('users')
                                    .add({
                                        uid: currentUser.uid,
                                        plan: plan,
                                    });
                                this.router.navigate([this.redirectUrl]);
                            },
                            function(error: any) {
                                console.log(error);
                            }
                        );
                }
            },
            err => {
                this.messageService.add({
                    severity: 'error',
                    key: 'global-toast',
                    life: 5000,
                    closable: true,
                    detail: `${err}`,
                });
            }
        );
    }

    public login(email: string, password: string) {
        from(this.firebaseService.getAuthInstance()!.signInWithEmailAndPassword(email, password)).subscribe(
            firebaseUser => {
                const { user } = firebaseUser;
                const parsedUser = {
                    id: user!.uid,
                    email: user!.email || undefined,
                    emailVerified: user!.emailVerified,
                };
                this.user = parsedUser;

                localStorage.setItem('id', parsedUser.id);
                localStorage.setItem('email', parsedUser.email || '');
                localStorage.setItem('emailVerified', parsedUser.emailVerified + '');

                this.router.navigate([this.redirectUrl]);
            },
            err => {
                this.messageService.add({
                    severity: 'error',
                    key: 'global-toast',
                    life: 5000,
                    closable: true,
                    detail: 'Invalid email or password.',
                });
            }
        );
    }

    public logout() {
        from(this.firebaseService.getAuthInstance()!.signOut()).subscribe(success => {
            this.user = undefined;
            localStorage.clear();
            this.router.navigate(['/auth/login']);
        });
    }
}
