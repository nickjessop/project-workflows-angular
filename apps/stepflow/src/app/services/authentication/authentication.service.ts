import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Project, Role, User, UserPlan } from '@stepflow/interfaces';
import * as _ from 'lodash';
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
    private readonly USER_COLLECTION_NAME = 'users';
    private _user: BehaviorSubject<User | undefined | null> = new BehaviorSubject<User | undefined | null>(undefined);
    public readonly $user = this._user?.asObservable();
    public readonly $loginStatus = new BehaviorSubject<{ authStatus: AuthStatus }>({ authStatus: AuthStatus.UNKNOWN });

    private subscriptions = new Subscription();
    public redirectUrl = '/project';
    private readonly PROJECT_COLLECTION_NAME = 'projects';
    private readonly INVITATIONS_COLLECTION_NAME = 'invitations';

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
            this.firebaseService.getAuthInstance().onAuthStateChanged(
                (user) => {
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
                (error) => {
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

    public register(email: string, password: string, firstName: string, lastName: string, plan: UserPlan) {
        from(this.createUserAndAttachMetadata(email, password, firstName, lastName, plan)).subscribe(
            (success) => {
                this.checkNewUserProjects(email);
                if (plan !== 'Essential') {
                    this.router.navigate(['/auth/confirmation?plan=' + plan]);
                } else {
                    this.router.navigate(['/auth/confirmation']);
                }
                if (!this.allowedUserIds.includes(this.user?.id || '')) {
                    this.logout(false);
                }
            },
            (error) => {
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

    private createUserAndAttachMetadata(
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        plan: UserPlan
    ) {
        const firebaseAuth = this.firebaseService.getAuthInstance();
        return firebaseAuth.setPersistence('local').then(() => {
            firebaseAuth
                .createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const { user } = userCredential;
                    const parsedUser = {
                        id: user!.uid,
                        email: user!.email || undefined,
                        emailVerified: user!.emailVerified,
                    };
                    this.user = parsedUser;
                    const updateUserMetadata = this.firebaseService
                        .getFunctionsInstance()
                        .httpsCallable('updateUserMetadata');
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

    async getUserMetaData() {
        if (this.user) {
            const userRef = this.firebaseService.getDbInstance().collection('users').doc(this.user.id);
            try {
                const doc = await userRef.get();
                if (doc.exists) {
                    this.user.plan = doc.data()?.plan || '';
                    this.user.photoFilePath = doc.data()?.photoFilePath || '';
                    this.user.firstName = doc.data()?.firstName || '';
                    this.user.lastName = doc.data()?.lastName || '';
                } else {
                    console.log('User does not exist.');
                }
            } catch (error) {
                // this.messageService.add({
                //     severity: 'error',
                //     key: 'global-toast',
                //     life: 5000,
                //     closable: true,
                //     detail: 'Error fetching user details.',
                // });
            }
        }
    }

    public getUserGroupMetaData(projectMembers: string[]) {
        const members: User[] = [];
        return this.firebaseService
            .getDbInstance()
            .collection('users')
            .where(this.firebaseService.getFieldPathId(), 'in', projectMembers)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data() as User;
                    members.push({ ...data, id: doc.id });
                });
                return members;
            })
            .catch((error) => {
                console.log('Error getting documents: ', error);
                return undefined;
            });
    }

    public setUserMetaData({
        photoFilePath,
        plan,
        firstName,
        lastName,
        email,
    }: {
        photoFilePath?: string;
        plan?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
    }) {
        if (!this.user) {
            return;
        }
        const update = {
            ...(photoFilePath ? { photoFilePath } : {}),
            ...(plan ? { plan } : {}),
            ...(firstName ? { firstName } : {}),
            ...(lastName ? { lastName } : {}),
            ...(email ? { email } : {}),
        };

        const userRef = this.firebaseService.getDbInstance().collection('users').doc(this.user.id);

        return userRef
            .update(update)
            .then(() => {
                return true;
            })
            .catch((error: Error) => {
                this.messageService.add({
                    severity: 'error',
                    key: 'global-toast',
                    life: 5000,
                    closable: true,
                    detail: 'Error updating user info.',
                });

                return false;
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
            (firebaseUser) => {
                const { user } = firebaseUser;

                if (user && !this.allowedUserIds.includes(user?.uid)) {
                    this.firebaseService.getAuthInstance()!.signOut();

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
            (err) => {
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
        this.firebaseService
            .getAuthInstance()!
            .signOut()
            .then(() => {
                this.user = undefined;
                if (redirect) {
                    this.router.navigate(['/auth/login']);
                }
            });
    }

    public reAuthenticateUser(userProvidedPassword: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const user = this.getCurrentUser();
            if (user && user.email) {
                const credential = this.firebaseService
                    .getProviderInstance()
                    .emailAuth.credential(user.email, userProvidedPassword);
                user.reauthenticateWithCredential(credential)
                    .then(function () {
                        resolve({ success: true });
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
        });
    }

    public findUsersMatchingEmail(emails: string[]) {
        // Firebase SDK limitation: 'in' supports up to 10 comparison values
        const newMembers: string[] = [];
        let pendingMembers: any[] = [];
        const foundMembers: string[] = [];
        return this.firebaseService
            .getDbInstance()
            .collection('users')
            .where('email', 'in', emails)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.id != '' || doc.id != undefined) {
                        newMembers.push(doc.id);
                        const data = doc.data() as User;
                        const docEmail = data.email || '';
                        foundMembers.push(docEmail);
                    }
                });
                pendingMembers = emails.filter((e) => !foundMembers.includes(e));
                return { newMembers: newMembers, pendingMembers: pendingMembers };
            })
            .catch((error) => {
                console.log('Error getting documents: ', error);
                return undefined;
            });
    }

    public checkNewUserProjects(email: string) {
        const db = this.firebaseService.getDbInstance()!;
        const invitationRef = db.collection(this.INVITATIONS_COLLECTION_NAME);
        const projects: { id: string; projectId: string; role: Role }[] = [];
        invitationRef
            .where('email', '==', email)
            .get()
            .then(async (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    projects.push({
                        id: doc.id,
                        projectId: doc.data().project.id,
                        role: doc.data().role,
                    });
                    doc.ref.delete();
                });
                const addNewUsersToProjects = await this.addNewUserToProjects(email, projects);
                return addNewUsersToProjects;
            });
    }

    private async addNewUserToProjects(email: string, projects: { projectId: string; role: Role }[]) {
        const userId = this.getCurrentUser()!.uid;
        if (!projects || !email || !userId) {
            return;
        }
        const db = this.firebaseService.getDbInstance()!;

        projects.forEach(async (project, index) => {
            try {
                await db.runTransaction(async (transaction) => {
                    let projectRef = db.collection(this.PROJECT_COLLECTION_NAME).doc(project.projectId);
                    const doc = await transaction.get(projectRef);

                    if (!doc.exists) {
                        return;
                    }
                    const _project = doc.data() as Project;
                    let newMember: { userId: string; role: Role }[] = [{ userId: userId, role: project.role }];
                    let _memberRoles: { userId: string; role: Role }[];
                    let _members: string[];
                    _members = _project.members;
                    _memberRoles = _project.memberRoles;
                    let members = _.union(_members, [userId]);
                    let memberRoles = _.union(_memberRoles, newMember);

                    const _pendingMembers = _project?.pendingMembers?.filter((pendingMember) => {
                        return pendingMember !== email;
                    });

                    transaction.update(projectRef, {
                        memberRoles: memberRoles,
                        members: members,
                        pendingMembers: _pendingMembers,
                    });
                });
            } catch (e) {
                console.log(`error running transaction ${e}`);
            }
        });
    }

    public updateProfileDetails(userDetails: User) {
        const photoURL = userDetails.photoURL || '/assets/placeholder/placeholder-profile.png';
        const plan = userDetails.plan || '';
        const photoFilePath = userDetails.photoFilePath || '';
        const firstName = userDetails.firstName || '';
        const lastName = userDetails.lastName || '';
        const email = userDetails.email || '';

        const currentUser = this.getCurrentUser();

        if (!currentUser || currentUser === null) {
            return;
        }

        currentUser
            .updateProfile({
                displayName: `${firstName} ${lastName}`,
                photoURL,
            })
            .then(
                () => {
                    this.setUserMetaData({ photoFilePath, plan, firstName, lastName, email });
                    this.messageService.add({
                        severity: 'success',
                        key: 'global-toast',
                        life: 5000,
                        closable: true,
                        detail: 'Profile updated',
                    });
                },
                (error: Error) => {
                    this.messageService.add({
                        severity: 'error',
                        key: 'global-toast',
                        life: 5000,
                        closable: true,
                        detail: 'Failed to update profile',
                    });
                }
            );
    }

    public async changeProfilePhoto(file?: File) {
        if (!file) {
            return;
        }

        // const currentUser = this.getCurrentUser();
        const currentUser = this.user;
        if (!currentUser) {
            return;
        }

        try {
            const currentFilePath = currentUser.photoFilePath;
            if (currentFilePath) {
                await this.storageService.deleteFile(currentFilePath);
            }

            const filesnapshot = await this.storageService.uploadProfileImage(file, currentUser.id!).toPromise();

            if (!filesnapshot) {
                throw new Error(`Failed to upload profile image`);
            }
            const downloadUrl = await this.storageService.getDownloadUrl(filesnapshot.metadata.fullPath).toPromise();
            const filePath = filesnapshot.metadata.fullPath;

            const firebaseUser = this.getCurrentUser();
            await firebaseUser!.updateProfile({ photoURL: downloadUrl });

            const success = await this.setUserMetaData({ photoFilePath: filePath });

            return success;
        } catch (e) {
            this.messageService.add({
                severity: 'error',
                key: 'global-toast',
                life: 5000,
                closable: true,
                detail: 'Failed to upload profile image',
            });

            return false;
        }
    }

    public updateEmail(email: string, userProvidedPassword: string): Promise<any> {
        // TODO: update email in user collection as well.. or switch to a different Auth provider?
        return new Promise((resolve, reject) => {
            const actionCodeSettings = {
                url: 'https://app.stepflow.co/profile',
            };

            const currentUser = this.getCurrentUser();
            if (currentUser) {
                this.reAuthenticateUser(userProvidedPassword)
                    .then(() => {
                        currentUser
                            .verifyBeforeUpdateEmail(email, actionCodeSettings)
                            .then(() => {
                                this.messageService.add({
                                    severity: 'success',
                                    key: 'global-toast',
                                    life: 5000,
                                    closable: true,
                                    detail: 'Verification email sent.',
                                });
                                resolve({ success: true });
                            })
                            .catch((error: Error) => {
                                this.messageService.add({
                                    severity: 'error',
                                    key: 'global-toast',
                                    life: 5000,
                                    closable: true,
                                    detail: 'Failed to update email address.',
                                });
                                reject(error);
                            });
                    })
                    .catch((error: Error) => {
                        this.messageService.add({
                            severity: 'error',
                            key: 'global-toast',
                            life: 5000,
                            closable: true,
                            detail: 'Incorrect password. Please try again.',
                        });
                    });
            }
        });
    }

    public updatePassword(userProvidedPassword: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const currentUser = this.getCurrentUser();
            if (currentUser) {
                const email = currentUser.email;

                if (!email || email === null) {
                    return;
                }

                this.reAuthenticateUser(userProvidedPassword)
                    .then(() => {
                        this.firebaseService
                            .getAuthInstance()
                            .sendPasswordResetEmail(email)
                            .then(() => {
                                this.messageService.add({
                                    severity: 'success',
                                    key: 'global-toast',
                                    life: 5000,
                                    closable: true,
                                    detail: 'Password reset email sent to ' + email,
                                });
                                resolve({ success: true });
                            })
                            .catch((error: Error) => {
                                this.messageService.add({
                                    severity: 'error',
                                    key: 'global-toast',
                                    life: 5000,
                                    closable: true,
                                    detail: 'Unable to send password reset email at this time.',
                                });
                                reject(error);
                                console.log(error);
                            });
                    })
                    .catch((error: Error) => {
                        this.messageService.add({
                            severity: 'error',
                            key: 'global-toast',
                            life: 5000,
                            closable: true,
                            detail: 'Incorrect password. Please try again.',
                        });
                        console.log(error);
                    });
            }
        });
    }

    public async getUsers(userIds: string[]): Promise<{ [key: string]: User }> {
        userIds = userIds.filter((value, index, self) => self.indexOf(value) === index);

        let users: { [key: string]: User } = {};
        for await (const userId of userIds) {
            const user = await this.getUser(userId);
            if (user) users[userId] = user;
        }

        return users;
    };

    public async getUser(userId: string): Promise<User | null> {
        return this.firebaseService
            .getDbInstance()!
            .collection(this.USER_COLLECTION_NAME)
            .doc(userId)
            .get()
            .then(
                querySnapshot => {
                    let user = querySnapshot.data() as User;
                    user.id = querySnapshot.id;
                    return user;
                },
                error => {
                    console.log(error);
                    return null;
                }
            );
    }
}
