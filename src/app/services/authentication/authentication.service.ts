import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, from, Subscription } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';

export interface User {
    id?: string;
    email?: string;
    emailVerified?: boolean;
    displayName?: string;
    photoURL?: string;
    photoFilePath?: string;
    plan?: string;
}

export type UserPlan = 'Plus' | 'Growth' | 'Essential' | 'Free';
export enum AuthStatus {
    AUTHENTICATED,
    UNAUTHENTICATED,
    UNKNOWN,
}

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private readonly USER_COLLECTION_NAME = 'users';
    private _user: BehaviorSubject<User | undefined | null> = new BehaviorSubject<User | undefined | null>(undefined);
    public readonly $user = this._user?.asObservable();
    public readonly $loginStatus = new BehaviorSubject<{ authStatus: AuthStatus }>({ authStatus: AuthStatus.UNKNOWN });

    private subscriptions = new Subscription();
    public redirectUrl = '/dashboard';

    constructor(
        private firebaseService: FirebaseService,
        private router: Router,
        private messageService: MessageService
    ) {
        this.setAuthStatus(this.user);
        this.initFirebaseUserListener();
    }

    private setAuthStatus(user?: User | null) {
        if (user === undefined) {
            this.$loginStatus.next({ authStatus: AuthStatus.UNKNOWN });
        } else if (user === null) {
            this.$loginStatus.next({ authStatus: AuthStatus.UNAUTHENTICATED });
        } else {
            this.$loginStatus.next({ authStatus: AuthStatus.AUTHENTICATED });
        }
    }

    initFirebaseUserListener() {
        // this.firebaseService.getAuthInstance().currentUser gets a snapshot of who the current user is.
        // Because Firebase has async calls to pull user info from Web SQL and then has to make an API call to fetch user info on initialization,
        // It doesn't make sense to use this synchronous user fetch method

        // this.firebaseService.getAuthInstance().onAuthStateChanged() gives us the opportunity to receive events on when
        // the user status changes (authenticated vs unauthenticated).  The problem is that onAuthStateChanged() sends us
        // a `null` user is not authenticated OR if firebase hasn't finished initializing (pulling from WEB sql & making API call).
        // This makes it extremely difficult to rely on it for checking for unauthenticated state for app initialization.

        this.subscriptions.add(
            this.firebaseService.getAuthInstance().onAuthStateChanged(
                user => {
                    if (user) {
                        this.user = {
                            id: user.uid,
                            email: user.email || '',
                            emailVerified: user.emailVerified,
                            displayName: user.displayName || '',
                            photoURL: user.photoURL || '',
                        };
                        this.getUserMetaData();
                        this.setAuthStatus(this.user);
                    } else {
                        this.setAuthStatus(null);
                    }
                },
                error => {
                    this.setAuthStatus(null);
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

    public getCurrentUser() {
        return this.firebaseService.getAuthInstance().currentUser;
    }

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

    async getUserMetaData() {
        if (this.user) {
            const userRef = this.firebaseService
                .getDbInstance()
                .collection('users')
                .doc(this.user.id);
            try {
                const doc = await userRef.get();
                if (doc.exists) {
                    this.user.plan = doc.data()?.plan || '';
                    this.user.photoFilePath = doc.data()?.photoFilePath || '';
                } else {
                    console.log('No such user!');
                }
            } catch (err) {
                console.log('Error getting user info:', err);
            }
        }
    }

    public setUserMetaData(photoFilePath: string, plan: string) {
        if (this.user) {
            const userRef = this.firebaseService
                .getDbInstance()
                .collection('users')
                .doc(this.user.id);
            userRef
                .set({
                    photoFilePath: photoFilePath,
                    plan: plan,
                })
                .then(() => {
                    return true;
                })
                .catch((err: any) => {
                    this.messageService.add({
                        severity: 'error',
                        key: 'global-toast',
                        life: 5000,
                        closable: true,
                        detail: 'Error updating user info.',
                    });
                });
        }
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
