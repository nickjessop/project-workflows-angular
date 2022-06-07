import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Profile, Project, Role, User, UserPlan } from '@stepflow/interfaces';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import * as _ from 'lodash';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';
import { SupabaseService } from '../supabase/supabase.service';

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

    public allowedUserIds = ['1de27b7a-f338-4b84-b4c1-36363580a1b1'];
    // public allowedUserIds = [
    //     '06T4lgj7x1emjUEMCmPnJYPFjum2',
    //     'iIeZlcLjmebZSoEMuquh4F2htN92',
    //     'LkkX7f9yheRFHNwZkoCHhMb6AmC2',
    //     'S09Ert0pOpRKdb7pnc4rXFfyeWe2',
    //     'o24opqInUhbxnC9MFywy3YLLBE03',
    //     '0ZLQk9ekq3RJXMc2RMpCE8NEkJ73',
    //     'tpXpbNAPKpX1evoxSeRJs0O0pB02',
    //     'IoTwZeoPiSemew2z5IBbQcHPaNi2',
    //     'DxOw25Q8XigIlZMfnfN7vaCaVPo1',
    // ];

    constructor(
        private firebaseService: FirebaseService,
        private readonly supabaseService: SupabaseService,
        private router: Router,
        private messageService: MessageService
    ) {
        this.setAuthStatus(this.user);
        this.initUserListener();
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

    initUserListener() {
        this.supabaseService.authChanges((event: AuthChangeEvent, session: Session | null) => {
            if (!session || session === null || session.user === null) {
                this.setAuthStatus(null);

                return;
            }

            const user = session.user;
            const userProfileData = user.user_metadata;
            this.user = {
                id: user.id,
                email: user.email,
                profile: {
                    displayName: userProfileData.displayName,
                    firstName: userProfileData.firstName,
                    lastName: userProfileData.lastName,
                    photoURL: userProfileData.photoURL,
                    plan: userProfileData.plan,
                },
            };

            this.setAuthStatus(this.user);
        });
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

    public async register(email: string, password: string, firstName: string, lastName: string, plan: UserPlan) {
        const { user } = await this.supabaseService.signUp(email, password, {
            firstName,
            lastName,
            plan,
            displayName: `${firstName} ${lastName}`,
        });
        if (!user || user === null) {
            return;
        }

        const allowedUserId = this.allowedUserIds.includes(user.id);
        if (!allowedUserId) {
            this.logout(false);
        }

        this.router.navigate(['/auth/confirmation']);
    }

    public getUserGroupMetaData(projectMembers: string[]) {
        const members: User[] = [];
        return this.firebaseService
            .getDbInstance()
            .collection('users')
            .where(this.firebaseService.getFieldPathId(), 'in', projectMembers)
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

    // public setUserMetaData({
    //     photoFilePath,
    //     plan,
    //     firstName,
    //     lastName,
    //     email,
    // }: {
    //     photoFilePath?: string;
    //     plan?: string;
    //     firstName?: string;
    //     lastName?: string;
    //     email?: string;
    // }) {
    //     if (!this.user) {
    //         return;
    //     }
    //     const update = {
    //         ...(photoFilePath ? { photoFilePath } : {}),
    //         ...(plan ? { plan } : {}),
    //         ...(firstName ? { firstName } : {}),
    //         ...(lastName ? { lastName } : {}),
    //         ...(email ? { email } : {}),
    //     };

    //     const userRef = this.firebaseService
    //         .getDbInstance()
    //         .collection('users')
    //         .doc(this.user.id);

    //     return userRef
    //         .update(update)
    //         .then(() => {
    //             return true;
    //         })
    //         .catch((error: Error) => {
    //             this.messageService.add({
    //                 severity: 'error',
    //                 key: 'global-toast',
    //                 life: 5000,
    //                 closable: true,
    //                 detail: 'Error updating user info.',
    //             });

    //             return false;
    //         });
    // }

    public async login(email: string, password: string) {
        const { user } = await this.supabaseService.signIn(email, password);

        if (!user || user === null) {
            this.messageService.add({
                severity: 'error',
                key: 'global-toast',
                life: 5000,
                closable: true,
                detail: 'Invalid email or password.',
            });
            return;
        }
        const allowedUserId = this.allowedUserIds.includes(user?.id);

        if (!allowedUserId) {
            this.messageService.add({
                severity: 'error',
                key: 'global-toast',
                life: 5000,
                closable: true,
                detail: 'You may not login at this time.',
            });

            await this.supabaseService.signOut();
            return;
        }

        const parsedUser = {
            id: user.id,
            email: user.email,
            profile: user.user_metadata as Profile,
        };
        this.user = parsedUser;
        this.router.navigate([this.redirectUrl]);
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
                    .then(function() {
                        resolve({ success: true });
                    })
                    .catch(error => {
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

    public checkNewUserProjects(email: string) {
        const db = this.firebaseService.getDbInstance()!;
        const invitationRef = db.collection(this.INVITATIONS_COLLECTION_NAME);
        const projects: { id: string; projectId: string; role: Role }[] = [];
        invitationRef
            .where('email', '==', email)
            .get()
            .then(async querySnapshot => {
                querySnapshot.forEach(doc => {
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
                await db.runTransaction(async transaction => {
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

                    const _pendingMembers = _project?.pendingMembers?.filter(pendingMember => {
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

    public updateProfileDetails(profile: Profile) {
        const updated = this.supabaseService.updateProfile(profile);
    }

    public async updateEmail(email: string): Promise<any> {
        const { user, error } = await this.supabaseService.auth.update({ email });

        if (error || user === null) {
            this.messageService.add({
                severity: 'error',
                key: 'global-toast',
                life: 5000,
                closable: true,
                detail: 'Failed to update email address.',
            });

            return;
        }

        // TODO: update email in user collection as well.. or switch to a different Auth provider?d
        // return new Promise((resolve, reject) => {
        //     const actionCodeSettings = {
        //         url: 'https://app.stepflow.co/profile',
        //     };

        //     const currentUser = this.getCurrentUser();
        //     if (currentUser) {
        //         this.reAuthenticateUser(userProvidedPassword)
        //             .then(() => {
        //                 currentUser
        //                     .verifyBeforeUpdateEmail(email, actionCodeSettings)
        //                     .then(() => {
        //                         this.messageService.add({
        //                             severity: 'success',
        //                             key: 'global-toast',
        //                             life: 5000,
        //                             closable: true,
        //                             detail: 'Verification email sent.',
        //                         });
        //                         resolve({ success: true });
        //                     })
        //                     .catch((error: Error) => {
        //                         this.messageService.add({
        //                             severity: 'error',
        //                             key: 'global-toast',
        //                             life: 5000,
        //                             closable: true,
        //                             detail: 'Failed to update email address.',
        //                         });
        //                         reject(error);
        //                     });
        //             })
        //             .catch((error: Error) => {
        //                 this.messageService.add({
        //                     severity: 'error',
        //                     key: 'global-toast',
        //                     life: 5000,
        //                     closable: true,
        //                     detail: 'Incorrect password. Please try again.',
        //                 });
        //             });
        //     }
        // });
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
}
