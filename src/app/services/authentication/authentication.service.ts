import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, from, Subscription } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';

export interface User {
    id?: string;
    email?: string;
    emailVerified?: boolean;
}

export type UserPlan = 'Plus' | 'Growth' | 'Essential' | 'Free';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private readonly USER_COLLECTION_NAME = 'users';
    private _user?: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
    public readonly $user = this._user?.asObservable();

    private subscriptions = new Subscription();
    public redirectUrl = '/dashboard';

    constructor(
        private firebaseService: FirebaseService,
        private router: Router,
        private messageService: MessageService
    ) {
        const user = this.firebaseService.getAuthInstance().currentUser;

        this.subscriptions.add(
            this.firebaseService.getAuthInstance().onAuthStateChanged(
                user => {
                    if (user) {
                        this.user = { id: user.uid, email: user.email || '', emailVerified: user.emailVerified };

                        if (this.router.url.includes('/auth/login')) {
                            this.router.navigate(['/dashboard']);
                        }
                    } else {
                        this.user = undefined;
                    }
                },
                error => {
                    console.log(error);
                }
            )
        );
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public get user() {
        return this._user?.getValue();
    }

    public set user(user) {
        this._user?.next(user);
    }

    // TODO: subscribe to user modification event, and set this as the user here as well as local storage

    public register(email: string, password: string, name: string, plan: UserPlan) {
        from(this.createUserAndAttachMetadata(email, password, name, plan)).subscribe(
            success => {
                this.router.navigate(['/auth/confirmation']);
            },
            error => {
                const msg = {
                    severity: 'error',
                    key: 'global-toast',
                    life: 5000,
                    closable: true,
                    detail: '',
                };

                msg.detail = error?.message ? error.message : error;

                this.messageService.add(msg);
            }
        );
    }

    private createUserAndAttachMetadata(email: string, password: string, name: string, plan: UserPlan) {
        const firebaseAuth = this.firebaseService.getAuthInstance();
        return firebaseAuth.setPersistence('local').then(() => {
            firebaseAuth.createUserWithEmailAndPassword(email, password).then(userCredential => {
                const { user } = userCredential;
                const parsedUser = {
                    id: user!.uid,
                    email: user!.email || undefined,
                    emailVerified: user!.emailVerified,
                };
                this.user = parsedUser;

                const updateUserMetadata = this.firebaseService
                    .getFunctionsInstance()
                    .httpsCallable('updateUserMetadata', {});

                return from(updateUserMetadata({ name, plan }));
            });
        });
    }

    public login(email: string, password: string) {
        // this.messageService.add({
        //     severity: 'error',
        //     key: 'global-toast',
        //     life: 5000,
        //     closable: true,
        //     detail: 'You may not login at this time.',
        // });

        // return;
        from(this.firebaseService.getAuthInstance()!.signInWithEmailAndPassword(email, password)).subscribe(
            firebaseUser => {
                const { user } = firebaseUser;
                const parsedUser = {
                    id: user!.uid,
                    email: user!.email || undefined,
                    emailVerified: user!.emailVerified,
                };
                this.user = parsedUser;
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
            this.router.navigate(['/auth/login']);
        });
    }
}
