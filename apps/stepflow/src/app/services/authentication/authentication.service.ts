import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Project, Role, User, UserPlan, USER_COLLECTION_NAME } from '@stepflow/interfaces';
import firebase from 'firebase';
import * as _ from 'lodash';
import { union as _union } from 'lodash';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, from, Subscription } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';
import { StorageService } from '../storage/storage.service';

export enum AuthStatus {
    AUTHENTICATED,
    UNAUTHENTICATED,
    UNKNOWN,
}

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private _user: BehaviorSubject<User | undefined | null> = new BehaviorSubject<User | undefined | null>(undefined);
    public readonly $user = this._user?.asObservable();
    public readonly $loginStatus = new BehaviorSubject<{ authStatus: AuthStatus }>({ authStatus: AuthStatus.UNKNOWN });

    private subscriptions = new Subscription();
    public redirectUrl = '/project';

    public allowedUserIds = [
        '06T4lgj7x1emjUEMCmPnJYPFjum2',
        'iIeZlcLjmebZSoEMuquh4F2htN92',
        'LkkX7f9yheRFHNwZkoCHhMb6AmC2',
        'S09Ert0pOpRKdb7pnc4rXFfyeWe2',
        'o24opqInUhbxnC9MFywy3YLLBE03',
        '0ZLQk9ekq3RJXMc2RMpCE8NEkJ73',
        'tpXpbNAPKpX1evoxSeRJs0O0pB02',
        'IoTwZeoPiSemew2z5IBbQcHPaNi2',
        'DxOw25Q8XigIlZMfnfN7vaCaVPo1',
        '3OqrvQESBPafZ7nF5U6v0QyM2B02',
    ];

    constructor(
        private firebaseService: FirebaseService,
        private router: Router,
        private messageService: MessageService,
        private storageService: StorageService
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
            this.firebaseService.auth.onAuthStateChanged(
                async user => {
                    if (user) {
                        await this.setUserData(user);
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
        return this.firebaseService.auth.currentUser;
    }

    public async register(email: string, password: string, firstName: string, lastName: string, plan: UserPlan) {
        await this.createUserAndAttachMetadata(email, password, firstName, lastName, plan).catch(error => {
            const msg = {
                severity: 'error',
                key: 'global-toast',
                life: 5000,
                closable: true,
                detail: '',
            };

            msg.detail = error?.message ? error.message : error;

            this.messageService.add(msg);
        });

        // this.checkNewUserProjects(email);
        if (plan !== 'Essential') {
            this.router.navigate(['/auth/confirmation?plan=' + plan]);
        } else {
            this.router.navigate(['/auth/confirmation']);
        }
        if (!this.allowedUserIds.includes(this.user?.id || '')) {
            this.logout(false);
        }
    }

    private createUserAndAttachMetadata(
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        plan: UserPlan
    ) {
        const firebaseAuth = this.firebaseService.auth;
        return firebaseAuth.setPersistence('local').then(() => {
            firebaseAuth
                .createUserWithEmailAndPassword(email, password)
                .then(userCredential => {
                    const { user } = userCredential;
                    const parsedUser = {
                        id: user!.uid,
                        email: user!.email || undefined,
                        emailVerified: user!.emailVerified,
                    };
                    this.user = parsedUser;
                    const updateUserMetadata = this.firebaseService.function.httpsCallable('updateUserMetadata');
                    // .httpsCallable('updateUserMetadata', {});

                    return from(updateUserMetadata({ firstName, lastName, plan, email }));
                })
                .then(() => {
                    this.getCurrentUser()!.updateProfile({
                        displayName: firstName + ' ' + lastName,
                    });
                });
        });
    }

    async setUserData(user: firebase.User) {
        const userRef = this.firebaseService.db.collection(USER_COLLECTION_NAME).doc(this.user?.id);
        const userDoc = await userRef.get();

        const obj = userDoc.exists
            ? {
                  plan: userDoc?.data()?.plan || '',
                  photoFilePath: userDoc?.data()?.photoFilePath || '',
                  firstName: userDoc?.data()?.firstName || '',
                  lastName: userDoc?.data()?.lastName || '',
              }
            : {};

        const _user = {
            id: user.uid,
            email: user.email || '',
            emailVerified: user.emailVerified,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            ...obj,
        };
        this.user = _user;
    }

    public getUserGroupMetaData(projectMembers: string[]) {
        const members: User[] = [];
        return this.firebaseService.db
            .collection(USER_COLLECTION_NAME)
            .where(this.firebaseService.fieldPathId, 'in', projectMembers)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const data = doc.data() as User;
                    members.push({ ...data, id: doc.id });
                });
                return members;
            })
            .catch(error => {
                console.log('Error getting documents: ', error);
                return undefined;
            });
    }

    // Updates our user metadata collection
    public async updateUserMetaData({
        photoFilePath,
        firstName,
        lastName,
        email,
    }: {
        photoFilePath?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
    }) {
        if (!this.user) {
            return;
        }
        const update = {
            ...(photoFilePath ? { photoFilePath } : {}),
            ...(firstName ? { firstName } : {}),
            ...(lastName ? { lastName } : {}),
            ...(email ? { email } : {}),
        };

        const userRef = this.firebaseService.db.collection(USER_COLLECTION_NAME).doc(this.user.id);
        await userRef.update(update).catch(e => {
            this.messageService.add({
                severity: 'error',
                key: 'global-toast',
                life: 5000,
                closable: true,
                detail: 'Error updating user info.',
            });
        });

        return update;
    }

    public login(email: string, password: string) {
        from(this.firebaseService.auth.signInWithEmailAndPassword(email, password)).subscribe(
            firebaseUser => {
                const { user } = firebaseUser;

                if (user && !this.allowedUserIds.includes(user?.uid)) {
                    this.firebaseService.auth.signOut();

                    this.messageService.add({
                        severity: 'error',
                        key: 'global-toast',
                        life: 5000,
                        closable: true,
                        detail: 'You may not login at this time.',
                    });

                    return;
                }

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

    public logout(redirect?: boolean) {
        this.firebaseService.auth.signOut().then(() => {
            this.user = undefined;
            if (redirect) {
                this.router.navigate(['/auth/login']);
            }
        });
    }

    public async reAuthenticateUser(userProvidedPassword: string) {
        const currentUser = this.getCurrentUser();
        if (!currentUser || !currentUser.email) {
            return false;
        }

        const credential = this.firebaseService.provider.emailAuth.credential(currentUser.email, userProvidedPassword);
        return currentUser
            .reauthenticateWithCredential(credential)
            .catch(e => {
                return false;
            })
            .then(success => {
                return success;
            });
    }

    public findUsersMatchingEmail(emails: string[]) {
        // Firebase SDK limitation: 'in' supports up to 10 comparison values
        const newMembers: string[] = [];
        let pendingMembers: any[] = [];
        const foundMembers: string[] = [];
        return this.firebaseService.db
            .collection(USER_COLLECTION_NAME)
            .where('email', 'in', emails)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    if (doc.id != '' || doc.id != undefined) {
                        newMembers.push(doc.id);
                        const data = doc.data() as User;
                        const docEmail = data.email || '';
                        foundMembers.push(docEmail);
                    }
                });
                pendingMembers = emails.filter(e => !foundMembers.includes(e));
                return { newMembers: newMembers, pendingMembers: pendingMembers };
            })
            .catch(error => {
                console.log('Error getting documents: ', error);
                return undefined;
            });
    }
}
